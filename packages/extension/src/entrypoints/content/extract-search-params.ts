import type { SearchParam } from "@anirec/annict";
import type { Vod } from "@/types";
import { asyncQuerySelector } from "@/utils/async-query-selector";
import { waitForTextContent } from "@/utils/dom";
import { fetchDMMContent, fetchDMMSeason, fetchUnext } from "@/utils/fetch";

type PageSource = {
  url: URL;
  queryRoot: ParentNode;
};

export const extractSearchParams = async (
  vod: Vod,
  pageSource: PageSource,
): Promise<SearchParam[] | undefined> => {
  switch (vod) {
    case "dmm":
      return await dmm(pageSource.url);
    case "unext":
      return await unext(pageSource.url);
    case "abema":
      return await abema(pageSource.queryRoot);
    case "danime":
      return await danime(pageSource.queryRoot);
    case "prime":
      return await prime(pageSource.queryRoot);
  }
};

const dmm = async (url: URL): Promise<SearchParam[] | undefined> => {
  const seasonId = url.searchParams.get("season");
  if (!seasonId) {
    return;
  }
  const contentId = url.searchParams.get("content");
  if (!contentId) {
    return;
  }

  const season = await fetchDMMSeason(seasonId);
  if (season.seasonType === "SINGLE_EPISODE") {
    return [
      {
        workTitle: season.seasonName,
        episodeTitle: "",
      },
    ];
  }
  const content = await fetchDMMContent(contentId);

  if (!content.episodeNumberName) {
    return [
      {
        workTitle: season.seasonName,
        episodeTitle: content.episodeTitle,
      },
      {
        workTitle: `${season.titleName} ${season.seasonName}`,
        episodeTitle: content.episodeTitle,
      },
    ];
  }

  return [
    {
      workTitle: season.seasonName,
      episodeNumber: content.episodeNumberName,
      episodeTitle: content.episodeTitle,
    },
    {
      workTitle: `${season.titleName} ${season.seasonName}`,
      episodeNumber: content.episodeNumberName,
      episodeTitle: content.episodeTitle,
    },
  ];
};

const unext = async (url: URL): Promise<SearchParam[] | undefined> => {
  const pathname = url.pathname;
  const pathnameMatch = pathname.match(/^\/play\/([^/]+)\/([^/]+)/);
  if (!pathnameMatch) {
    return;
  }
  const workId = pathnameMatch[1];
  const episodeId = pathnameMatch[2];

  const data = await fetchUnext(workId, episodeId);

  if (data.publishStyleCode === "VOD_SINGLE") {
    return [
      {
        workTitle: data.titleName,
        episodeNumber: "",
        episodeTitle: "",
      },
    ];
  }

  return [
    {
      workTitle: data.titleName,
      episodeNumber: data.episode.displayNo,
      episodeTitle: data.episode.episodeName,
    },
  ];
};

const abema = async (
  queryRoot: ParentNode,
): Promise<SearchParam[] | undefined> => {
  const workTitle = (
    await asyncQuerySelector(".com-video-EpisodeTitle__series-info", queryRoot)
  )?.textContent;
  const episodeTitle =
    (
      await asyncQuerySelector(
        ".com-video-EpisodeTitle__episode-title",
        queryRoot,
      )
    )?.textContent || "";
  if (!workTitle) {
    return;
  }

  // 複数シーズンある作品の場合
  // e.g. 響け！ユーフォニアム | 響け!ユーフォニアム3
  // e.g. ちはやふる | 第1期
  const workTitleMatch = workTitle.match(/^(.*) \| (.*)$/);
  if (workTitleMatch) {
    return [
      {
        workTitle: workTitleMatch[2],
        episodeTitle: episodeTitle,
      },
      {
        workTitle: `${workTitleMatch[1]} ${workTitleMatch[2]}`,
        episodeTitle: episodeTitle,
      },
    ];
  }

  return [
    {
      workTitle: workTitle,
      episodeTitle: episodeTitle,
    },
  ];
};

const danime = async (
  queryRoot: ParentNode,
): Promise<SearchParam[] | undefined> => {
  const workElem = await asyncQuerySelector(".backInfoTxt1", queryRoot);
  if (!workElem) {
    return;
  }
  const workTitle = await waitForTextContent(workElem);
  if (!workTitle) {
    return;
  }
  const episodeNumber =
    (await asyncQuerySelector(".backInfoTxt2", queryRoot))?.textContent || "";
  const episodeTitle =
    (await asyncQuerySelector(".backInfoTxt3", queryRoot))?.textContent || "";

  return [{ workTitle, episodeNumber, episodeTitle }];
};

const prime = async (
  queryRoot: ParentNode,
): Promise<SearchParam[] | undefined> => {
  const titleElem = await asyncQuerySelector(
    "#dv-web-player h1.atvwebplayersdk-title-text",
    queryRoot,
  );
  if (!titleElem) {
    return;
  }
  const workTitle = await waitForTextContent(titleElem);
  if (!workTitle) {
    return;
  }

  const subtitleElem = await asyncQuerySelector(
    "#dv-web-player h2.atvwebplayersdk-subtitle-text",
    queryRoot,
  );
  const subtitleText = subtitleElem
    ? ((await waitForTextContent(subtitleElem)) ?? "")
    : "";

  // "シーズン1、エピソード1 エピソードタイトル" のような形式をパース
  const subtitleMatch = subtitleText.match(
    /^シーズン\d+、エピソード\d+\s*(.*)/,
  );
  if (subtitleMatch) {
    return [
      {
        workTitle,
        episodeTitle: subtitleMatch[1] || "",
      },
    ];
  }

  return [{ workTitle, episodeTitle: subtitleText }];
};
