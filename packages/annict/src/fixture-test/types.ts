import type { SearchParam, Work } from "../types";

export type Fixture = {
	input: {
		params: SearchParam;
		annictUrl: string;
	};
	meta: {
		createdAt: string;
	};
	expected: Expected;
	variants: string[];
	candidateWorks: Work[];
};

export type Expected = {
	id: string;
	title: string;
	episode: ExpectedEpisode | null;
};

export type ExpectedEpisode = {
	id: string;
	title: string | undefined;
	numberText: string | undefined;
	number: number | undefined;
};

export type ParamPattern =
	| "title"
	| "workTitle-episodeTitle"
	| "workTitle-episodeNumber-episodeTitle";

export type AnnictTarget =
	| { type: "Work"; workId: string }
	| { type: "Episode"; workId: string; episodeId: string };
