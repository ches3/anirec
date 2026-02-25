import type { BaseIssue, BaseSchema } from "valibot";
import {
  array,
  literal,
  nullable,
  number,
  object,
  parse,
  string,
  union,
} from "valibot";

export const fetchGql = async <T>(
  endpoint: string,
  query: string,
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
) => {
  const res = await fetch(endpoint, {
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
        titleName: string(),
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
				titleName
        seasonName
        seasonType
      }
    }
  `;

  const endpoint = "https://api.tv.dmm.com/graphql";

  const data = await fetchGql(endpoint, query, Schema);
  return data?.data.video;
};

export const fetchDMMContent = async (contentId: string) => {
  const Schema = object({
    data: object({
      videoContent: object({
        episodeTitle: string(),
        episodeNumberName: nullable(string()),
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

  const endpoint = "https://api.tv.dmm.com/graphql";

  const data = await fetchGql(endpoint, query, Schema);
  return data?.data.videoContent;
};

export const fetchUnext = async (workId: string, episodeId: string) => {
  const Schema = object({
    data: object({
      webfront_title_stage: object({
        titleName: string(),
        publishStyleCode: union([literal("VOD_SINGLE"), literal("VOD_MULTI")]),
        episode: object({
          displayNo: string(),
          episodeName: string(),
        }),
      }),
    }),
  });

  const query = `
		query FetchTitle {
			webfront_title_stage(id: "${workId}") {
				titleName
				publishStyleCode
				episode(id: "${episodeId}") {
					displayNo
					episodeName
				}
			}
		}
	`;

  const endpoint = "https://cc.unext.jp";

  const data = await fetchGql(endpoint, query, Schema);
  return data?.data.webfront_title_stage;
};

export const fetchNetflix = async (videoId: number) => {
  const Schema = object({
    data: object({
      unifiedEntities: array(
        union([
          object({
            __typename: literal("Episode"),
            videoId: number(),
            title: string(),
            number: number(),
            parentSeason: object({
              title: string(),
            }),
            parentShow: object({
              titleGroupMemberships: array(
                object({
                  title: string(),
                }),
              ),
            }),
          }),
          object({
            __typename: literal("Movie"),
            videoId: number(),
            title: string(),
          }),
        ]),
      ),
    }),
  });

  const res = await fetch("https://web.prod.cloud.netflix.com/graphql", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationName: "DetailModal",
      variables: {
        opaqueImageFormat: "WEBP",
        transparentImageFormat: "WEBP",
        videoMerchEnabled: false,
        fetchPromoVideoOverride: false,
        hasPromoVideoOverride: false,
        promoVideoId: 0,
        videoMerchContext: "BROWSE",
        isLiveEpisodic: false,
        artworkContext: {},
        textEvidenceUiContext: "ODP",
        unifiedEntityId: `Video:${videoId}`,
      },
      extensions: {
        persistedQuery: {
          id: "76c01761-731d-48bd-8ce9-81c37e0bb3a3",
          version: 102,
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const validated = parse(Schema, json);
  const entity = validated.data.unifiedEntities[0];
  if (!entity) {
    throw new Error("Netflix のエピソードデータが見つかりませんでした。");
  }
  return entity;
};
