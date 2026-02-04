import type { ExtractedEpisode, SearchParam } from "../../types";
import { episodeNumberMatches } from "../match";
import { parseNumber } from "./number";

function getMatch(
	str: string,
	matches: string[],
): Record<string, string> | undefined {
	for (const match of matches) {
		const regex = new RegExp(match, "i");
		const result = str.match(regex);
		if (!result || !result.groups) {
			continue;
		}
		return result.groups;
	}
}

export function extract(params: { title: string }): {
	workTitle: string;
	episode: ExtractedEpisode | undefined;
};
export function extract(params: { workTitle: string; episodeTitle: string }): {
	workTitle: string;
	episode: ExtractedEpisode | undefined;
};
export function extract(params: {
	workTitle: string;
	episodeNumber: string;
	episodeTitle: string;
}): {
	workTitle: string;
	episode: ExtractedEpisode | undefined;
};
export function extract(params: SearchParam): {
	workTitle: string;
	episode: ExtractedEpisode | undefined;
} {
	if ("episodeNumber" in params) {
		return {
			workTitle: params.workTitle,
			episode: {
				number: parseNumber(params.episodeNumber),
				numberText: params.episodeNumber,
				title: params.episodeTitle,
			},
		};
	}
	if ("title" in params) {
		const target = extractFullTitle(params.title);
		return {
			workTitle: target.title,
			episode: target.episode,
		};
	}
	const episode = extractEpisode(params.episodeTitle);
	return {
		workTitle: params.workTitle,
		episode,
	};
}

export function extractEpisode(str: string): ExtractedEpisode | undefined {
	const trimmed = str.trim();
	const matches = [
		...episodeNumberMatches.map(
			(m) => `^(?<episodeNumber>${m})\\s+(?<episodeTitle>.*)$`,
		),
		// カギ括弧で囲われたサブタイトルと話数の間にスペースがないケース
		...episodeNumberMatches.map(
			(m) => `^(?<episodeNumber>${m})「(?<episodeTitle>[^」]+)」$`,
		),
		...episodeNumberMatches.map((m) => `^(?<episodeNumber>${m})$`),
	];
	const matchGroups = getMatch(trimmed, matches);
	const episodeNumber = matchGroups?.episodeNumber;
	const episodeTitle = matchGroups?.episodeTitle;

	if (episodeNumber) {
		const parsedNumber = parseNumber(episodeNumber);
		return {
			number: parsedNumber,
			numberText: episodeNumber,
			title: episodeTitle,
		};
	}

	return {
		number: undefined,
		numberText: undefined,
		title: str,
	};
}

export function extractFullTitle(title: string): {
	title: string;
	episode: ExtractedEpisode | undefined;
} {
	const trimmed = title.trim();
	const matches = [
		...episodeNumberMatches.map(
			(m) =>
				`^(?<workTitle>.*?)\\s+(?<episodeNumber>${m})\\s+(?<episodeTitle>.*)$`,
		),
		// カギ括弧で囲われたサブタイトルと話数の間にスペースがないケース
		...episodeNumberMatches.map(
			(m) =>
				`^(?<workTitle>.*?)\\s+(?<episodeNumber>${m})「(?<episodeTitle>[^」]+)」$`,
		),
		...episodeNumberMatches.map(
			(m) => `^(?<workTitle>.*?)\\s+(?<episodeNumber>${m})$`,
		),
	];
	const matchGroups = getMatch(trimmed, matches);
	const workTitle = matchGroups?.workTitle;
	const episodeNumber = matchGroups?.episodeNumber;
	const episodeTitle = matchGroups?.episodeTitle;

	if (workTitle && episodeNumber) {
		const parsedNumber = parseNumber(episodeNumber);
		return {
			title: workTitle,
			episode: {
				number: parsedNumber,
				numberText: episodeNumber,
				title: episodeTitle,
			},
		};
	}

	// dアニメの劇場版等の作品
	// e.g. "リズと青い鳥 本編　"
	const honpen = trimmed.match(/^(.*)\s+本編$/);
	if (honpen) {
		return {
			title: honpen[1],
			episode: undefined,
		};
	}

	return {
		title: title,
		episode: undefined,
	};
}
