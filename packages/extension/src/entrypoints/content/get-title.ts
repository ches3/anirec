import { fetchDMMContent, fetchDMMSeason, fetchUnext } from "@/utils/fetch";
import { asyncQuerySelector } from "./async-query-selector";

export const getTitleList = async (
	hostname: string,
): Promise<Title[] | undefined> => {
	if (hostname === "tv.dmm.com") {
		return await dmm();
	}
	if (hostname === "video.unext.jp") {
		return await unext();
	}
	if (hostname === "abema.tv") {
		return await abema();
	}
	if (hostname === "animestore.docomo.ne.jp") {
		return await danime();
	}
	throw new Error("サポートされていないサイトです。");
};

const dmm = async (): Promise<Title[] | undefined> => {
	const searchParams = new URLSearchParams(location.search);
	const seasonId = searchParams.get("season");
	if (!seasonId) {
		return;
	}
	const contentId = searchParams.get("content");
	if (!contentId) {
		return;
	}

	const season = await fetchDMMSeason(seasonId);
	if (!season) {
		return;
	}
	if (season.seasonType === "SINGLE_EPISODE") {
		return [
			{
				workTitle: season.seasonName,
				episodeNumber: "",
				episodeTitle: "",
			},
		];
	}
	const content = await fetchDMMContent(contentId);
	if (!content) {
		return;
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

const unext = async (): Promise<Title[] | undefined> => {
	const pathname = location.pathname;
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

const abema = async (): Promise<Title[] | undefined> => {
	const workTitle = (
		await asyncQuerySelector(".com-video-EpisodeTitle__series-info")
	)?.textContent;
	const episodeTitle =
		(await asyncQuerySelector(".com-video-EpisodeTitle__episode-title"))
			?.textContent || "";
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

const danime = async (): Promise<Title[] | undefined> => {
	const workTitle = (await asyncQuerySelector(".backInfoTxt1"))?.textContent;
	if (!workTitle) {
		return;
	}
	const episodeNumber =
		(await asyncQuerySelector(".backInfoTxt2"))?.textContent || "";
	const episodeTitle =
		(await asyncQuerySelector(".backInfoTxt3"))?.textContent || "";

	return [{ workTitle, episodeNumber, episodeTitle }];
};
