import { fetchDMMContent, fetchDMMSeason } from "@/utils/fetch";
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
				episodeTitle: "",
			},
		];
	}
	const content = await fetchDMMContent(contentId);
	if (!content) {
		return;
	}
	const episodeTitle = `${content.episodeNumberName} ${content.episodeTitle}`;

	return [
		{
			workTitle: season.seasonName,
			episodeTitle: episodeTitle,
		},
		{
			workTitle: `${season.titleName} ${season.seasonName}`,
			episodeTitle: episodeTitle,
		},
	];
};

const unext = async (): Promise<Title[] | undefined> => {
	const workTitle = (await asyncQuerySelector("h2"))?.textContent;
	const episodeTitle = (await asyncQuerySelector("h3"))?.textContent || "";
	if (!workTitle) {
		return;
	}

	return [
		{
			workTitle: workTitle,
			episodeTitle: episodeTitle,
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
