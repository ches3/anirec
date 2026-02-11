import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
import {
	CreateRecordDocument,
	CreateReviewDocument,
	FetchNodeDocument,
	SearchWorksDocument,
	ViewerActivitiesDocument,
} from "../gql/generated";
import type { Activities, Episode, Work } from "../types";

const endpoint = "https://api.annict.com/graphql";

type GraphQLResponse<TResult> = {
	data?: TResult;
	errors?: { message?: string }[];
};

type GraphQLDocument<TResult, TVariables> = DocumentTypeDecoration<
	TResult,
	TVariables
> & {
	toString(): string;
};

function normalizeText(value: string | null | undefined): string | undefined {
	if (value === "") {
		return undefined;
	}
	return value ?? undefined;
}

async function requestGraphQL<TResult, TVariables>(
	document: GraphQLDocument<TResult, TVariables>,
	variables: TVariables,
	token: string,
): Promise<TResult> {
	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			authorization: `Bearer ${token}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({
			query: document.toString(),
			variables,
		}),
	});

	if (!response.ok) {
		throw new Error(`GraphQL request failed: ${response.status}`);
	}

	const payload = (await response.json()) as GraphQLResponse<TResult>;

	if (payload?.errors?.length) {
		const message = payload.errors
			.map((error) => error.message)
			.filter((message): message is string => !!message)
			.join("\n");
		throw new Error(message || "GraphQL request failed");
	}
	if (payload?.data === undefined) {
		throw new Error("GraphQL response has no data");
	}

	return payload.data;
}

export async function fetchNode(
	id: string,
	token: string,
): Promise<
	| { type: "Work"; work: Work; episode: null }
	| { type: "Episode"; work: Omit<Work, "episodes">; episode: Episode }
> {
	const data = await requestGraphQL(FetchNodeDocument, { id }, token);

	const node = data.node;
	if (!node) {
		throw new Error(`Node not found: ${id}`);
	}

	if (node.__typename === "Episode") {
		const episode: Episode = {
			id: node.id,
			title: normalizeText(node.episodeTitle),
			number: node.number ?? undefined,
			numberText: normalizeText(node.numberText),
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
					title: normalizeText(episode.title),
					number: episode.number ?? undefined,
					numberText: normalizeText(episode.numberText),
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
	const data = await requestGraphQL(SearchWorksDocument, { titles }, token);
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
							title: normalizeText(episode.title),
							number: episode.number ?? undefined,
							numberText: normalizeText(episode.numberText),
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
	const data = await requestGraphQL(
		ViewerActivitiesDocument,
		{ last, after },
		token,
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
	const data = await requestGraphQL(CreateRecordDocument, { id }, token).catch(
		(e) => {
			const regex = new RegExp(`^Invalid input: "${id}": (.*)`);
			if (e instanceof Error && e.message.match(regex)) {
				throw new Error(`Invalid id: ${id}`);
			}
			throw e;
		},
	);
	return data;
}

export async function createReview(id: string, token: string) {
	const data = await requestGraphQL(CreateReviewDocument, { id }, token).catch(
		(e) => {
			const regex = new RegExp(`^Invalid input: "${id}"`);
			if (e instanceof Error && e.message.match(regex)) {
				throw new Error(`Invalid id: ${id}`);
			}
			throw e;
		},
	);
	return data;
}
