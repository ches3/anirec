import type { BaseIssue, BaseSchema } from "valibot";
import { literal, object, parse, string, union } from "valibot";

export const fetchGql = async <T>(
	query: string,
	schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
) => {
	const res = await fetch("https://api.tv.dmm.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: query,
		}),
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
	}

	const json = await res.json();
	const validated = parse(schema, json);
	return validated;
};

export const fetchDMMSeason = async (seasonId: string) => {
	const Schema = object({
		data: object({
			video: object({
				seasonName: string(),
				seasonType: union([
					literal("SINGLE_EPISODE"),
					literal("MULTI_EPISODES"),
				]),
			}),
		}),
	});

	const query = `
    query FetchVideo {
      video(id: "${seasonId}") {
        seasonName
        seasonType
      }
    }
  `;

	const data = await fetchGql(query, Schema);
	return data?.data.video;
};

export const fetchDMMContent = async (contentId: string) => {
	const Schema = object({
		data: object({
			videoContent: object({
				episodeTitle: string(),
				episodeNumberName: string(),
			}),
		}),
	});

	const query = `
    query FetchVideoContent {
      videoContent(id: "${contentId}") {
        episodeTitle
        episodeNumberName
      }
    }
  `;

	const data = await fetchGql(query, Schema);
	return data?.data.videoContent;
};
