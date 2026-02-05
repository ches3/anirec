import { request } from "graphql-request";
import {
	CreateRecordDocument,
	CreateReviewDocument,
	FetchNodeDocument,
	SearchWorksDocument,
	ViewerActivitiesDocument,
} from "../gql/generated";
import type { Activities, Episode, Work } from "../types";

const endpoint = "https://api.annict.com/graphql";

export async function fetchNode(
	id: string,
	token: string,
): Promise<
	| { type: "Work"; work: Work; episode: null }
	| { type: "Episode"; work: Omit<Work, "episodes">; episode: Episode }
> {
	const data = await request(
		endpoint,
		FetchNodeDocument,
		{ id },
		{ authorization: `Bearer ${token}` },
	);

	const node = data.node;
	if (!node) {
		throw new Error(`Node not found: ${id}`);
	}

	if (node.__typename === "Episode") {
		const episode: Episode = {
			id: node.id,
			title: node.episodeTitle ?? undefined,
			number: node.number ?? undefined,
			numberText: node.numberText ?? undefined,
		};
		const seriesList = node.work.seriesList?.nodes
			?.map((series) => series?.name)
			.filter((name) => name !== undefined);
		const work = {
			id: node.work.id,
			title: node.work.workTitle,
			noEpisodes: false, // エピソードが存在するため
			seriesList: seriesList,
		};
		return { type: "Episode", work, episode };
	}

	if (node.__typename === "Work") {
		const seriesList = node.seriesList?.nodes
			?.map((series) => series?.name)
			.filter((name) => name !== undefined);
		const work = {
			id: node.id,
			title: node.workTitle,
			noEpisodes: node.noEpisodes,
			episodes: node.episodes?.nodes
				?.filter((episode) => !!episode)
				.map((episode) => ({
					id: episode.id,
					title: episode.title || undefined,
					number: episode.number || undefined,
					numberText: episode.numberText || undefined,
				})),
			seriesList: seriesList,
		};
		return { type: "Work", work, episode: null };
	}

	throw new Error(`Unexpected node type: ${node.__typename}`);
}

export async function searchWorks(
	titles: string[],
	token: string,
): Promise<Work[]> {
	const data = await request(
		endpoint,
		SearchWorksDocument,
		{ titles },
		{ authorization: `Bearer ${token}` },
	);
	const nodes = data.searchWorks?.nodes;
	if (!nodes) {
		throw new Error("Failed to fetch data");
	}

	const works = nodes
		.map((work) => {
			if (!work) {
				return undefined;
			}

			const episodes = work.episodes?.nodes
				?.map(
					(episode) =>
						episode && {
							id: episode.id,
							title: episode.title || undefined,
							number: episode.number || undefined,
							numberText: episode.numberText || undefined,
						},
				)
				.filter((episode) => !!episode);

			const seriesList = work.seriesList?.nodes
				?.map((series) => series?.name)
				.filter((name) => name !== undefined);

			return {
				id: work.id,
				title: work.title,
				noEpisodes: work.noEpisodes,
				episodes: episodes,
				seriesList: seriesList,
			};
		})
		.filter((work) => !!work);
	return works;
}

export async function viewerActivities(
	last: number,
	after: string,
	token: string,
): Promise<Activities> {
	const data = await request(
		endpoint,
		ViewerActivitiesDocument,
		{ last, after },
		{ authorization: `Bearer ${token}` },
	);
	if (!data.viewer?.activities?.edges) {
		throw new Error("Failed to fetch data");
	}
	const edges = data.viewer?.activities?.edges;
	const pageInfo = data.viewer.activities.pageInfo;
	const cursor = "endCursor" in pageInfo ? pageInfo.endCursor : null;
	const items = edges
		.map((edge) => {
			if (
				edge?.item?.__typename === "Record" ||
				edge?.item?.__typename === "Review"
			) {
				return edge?.item;
			}
			return undefined;
		})
		.filter((item) => !!item);
	return { items, cursor };
}

export async function createRecord(id: string, token: string) {
	const data = await request(
		endpoint,
		CreateRecordDocument,
		{ id },
		{ authorization: `Bearer ${token}` },
	).catch((e) => {
		const regex = new RegExp(`^Invalid input: "${id}": (.*)`);
		if (e instanceof Error && e.message.match(regex)) {
			throw new Error(`Invalid id: ${id}`);
		}
		throw e;
	});
	return data;
}

export async function createReview(id: string, token: string) {
	const data = await request(
		endpoint,
		CreateReviewDocument,
		{ id },
		{ authorization: `Bearer ${token}` },
	).catch((e) => {
		const regex = new RegExp(`^Invalid input: "${id}"`);
		if (e instanceof Error && e.message.match(regex)) {
			throw new Error(`Invalid id: ${id}`);
		}
		throw e;
	});
	return data;
}
