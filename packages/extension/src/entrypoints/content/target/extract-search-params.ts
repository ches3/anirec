import type { SearchParam } from "@anirec/annict";
import type { Vod } from "@/types";
import { asyncQuerySelector } from "@/utils/async-query-selector";
import { waitForTextContent } from "@/utils/dom";
import {
  fetchDMMContent,
  fetchDMMSeason,
  fetchNetflix,
  fetchUnext,
} from "@/utils/fetch";

type PageSource = {
  url: URL;
  queryRoot: ParentNode;
};

export const extractSearchParams = async (
  vod: Vod,
  pageSource: PageSource,
): Promise<SearchParam[]> => {
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
    case "netflix":
      return await netflix(pageSource.url);
  }
};

const dmm = async (url: URL): Promise<SearchParam[]> => {
  const seasonId = url.searchParams.get("season");
  if (!seasonId) {
    throw new Error("season パラメータがありません。");
  }
  const contentId = url.searchParams.get("content");
  if (!contentId) {
    throw new Error("content パラメータがありません。");
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

const unext = async (url: URL): Promise<SearchParam[]> => {
  const pathname = url.pathname;
  const pathnameMatch = pathname.match(/^\/play\/([^/]+)\/([^/]+)/);
  if (!pathnameMatch) {
    throw new Error("再生ページの URL 形式が不正です。");
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

const abema = async (queryRoot: ParentNode): Promise<SearchParam[]> => {
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
    throw new Error("作品タイトルが取得できませんでした。");
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

const danime = async (queryRoot: ParentNode): Promise<SearchParam[]> => {
  const workElem = await asyncQuerySelector(".backInfoTxt1", queryRoot);
  if (!workElem) {
    throw new Error("作品タイトル要素が見つかりませんでした。");
  }
  const workTitle = await waitForTextContent(workElem);
  if (!workTitle) {
    throw new Error("作品タイトルの取得に失敗しました。");
  }
  const episodeNumber =
    (await asyncQuerySelector(".backInfoTxt2", queryRoot))?.textContent || "";
  const episodeTitle =
    (await asyncQuerySelector(".backInfoTxt3", queryRoot))?.textContent || "";

  return [{ workTitle, episodeNumber, episodeTitle }];
};

const prime = async (queryRoot: ParentNode): Promise<SearchParam[]> => {
  const titleElem = await asyncQuerySelector(
    "#dv-web-player h1.atvwebplayersdk-title-text",
    queryRoot,
  );
  if (!titleElem) {
    throw new Error("作品タイトル要素が見つかりませんでした。");
  }
  const workTitle = await waitForTextContent(titleElem);
  if (!workTitle) {
    throw new Error("作品タイトルの取得に失敗しました。");
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

const netflix = async (url: URL): Promise<SearchParam[]> => {
  const videoIdStr = url.pathname.match(/^\/watch\/(\d+)/)?.[1];
  if (!videoIdStr) {
    throw new Error("Netflix の動画 ID を取得できませんでした。");
  }
  const videoId = Number(videoIdStr);

  const data = await fetchNetflix(videoId);

  if (data.__typename === "Movie") {
    return [
      {
        workTitle: data.title,
        episodeTitle: "",
      },
    ];
  }

  const params: SearchParam[] = [
    {
      workTitle: data.parentSeason.title,
      episodeNumber: String(data.number),
      episodeTitle: data.title,
    },
    {
      workTitle: data.parentSeason.title,
      episodeTitle: data.title,
    },
  ];

  // titleGroupMemberships が非空の場合、コレクション名から " コレクション" を除去して show タイトルを導出
  const collectionTitle = data.parentShow.titleGroupMemberships[0]?.title;
  if (collectionTitle) {
    const showTitle = collectionTitle.replace(/ コレクション$/, "");
    params.unshift(
      {
        workTitle: showTitle,
        episodeNumber: String(data.number),
        episodeTitle: data.title,
      },
      {
        workTitle: showTitle,
        episodeTitle: data.title,
      },
    );
  }

  return params;
};
