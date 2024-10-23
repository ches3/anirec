import { asyncQuerySelector } from "./async-query-selector";

export const getTitle = async (hostname: string) => {
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

const dmm = async () => {
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
		return {
			work: season.seasonName,
			episode: "",
		};
	}
	const content = await fetchDMMContent(contentId);
	if (!content) {
		return;
	}
	const episodeTitle = content.episodeTitle
		? `${content.episodeNumberName} ${content.episodeTitle}`
		: content.episodeNumberName;

	return {
		work: season.seasonName,
		episode: episodeTitle,
	};
};

const unext = async () => {
	const workTitle = (await asyncQuerySelector("h2"))?.textContent;
	const episodeTitle = (await asyncQuerySelector("h3"))?.textContent || "";
	if (!workTitle) {
		return;
	}

	return {
		work: workTitle,
		episode: episodeTitle,
	};
};

const abema = async () => {
	const workTitle = (
		await asyncQuerySelector(".com-video-EpisodeTitle__series-info")
	)?.textContent;
	const episodeTitle =
		(await asyncQuerySelector(".com-video-EpisodeTitle__episode-title"))
			?.textContent || "";
	if (!workTitle) {
		return;
	}

	const workTitleMatch = workTitle.match(/^.* \| (.*)$/);
	if (workTitleMatch) {
		return {
			work: workTitleMatch[1],
			episode: episodeTitle,
		};
	}

	return {
		work: workTitle,
		episode: episodeTitle,
	};
};
