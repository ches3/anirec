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
  variables?: Record<string, unknown>,
) => {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables,
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
      }),
      webfront_title_titleEpisodes: object({
        episodes: array(
          object({
            id: string(),
            displayNo: string(),
            episodeName: string(),
          }),
        ),
      }),
    }),
  });

  const query = `query cosmo_getTitle($id: ID!, $episodeCode: ID!, $episodePage: Int, $episodePageSize: Int) {
  webfront_title_stage(id: $id) {
    id
    titleName
    publishStyleCode
    episode(id: $episodeCode) {
      id
      hasSubtitle
      hasDub
      __typename
    }
    __typename
  }
  webfront_title_titleEpisodes(
    id: $id
    page: $episodePage
    pageSize: $episodePageSize
  ) {
    episodes {
      id
      episodeName
      displayNo
      thumbnail {
        standard
        __typename
      }
      duration
      interruption
      completeFlag
      __typename
    }
    __typename
  }
}
`;

  const endpoint = "https://cc.unext.jp";

  for (let episodePage = 1; ; episodePage++) {
    const { data } = await fetchGql(endpoint, query, Schema, {
      id: workId,
      episodeCode: episodeId,
      episodePage,
      episodePageSize: 1000,
    });
    const title = data.webfront_title_stage;
    const episodes = data.webfront_title_titleEpisodes.episodes;
    const episode = episodes.find((episode) => episode.id === episodeId);
    if (episode) {
      return {
        ...title,
        episode:
          title.publishStyleCode === "VOD_SINGLE"
            ? { displayNo: "", episodeName: "" }
            : {
                displayNo: episode.displayNo,
                episodeName: episode.episodeName,
              },
      };
    }
    if (episodes.length === 0) {
      throw new Error(
        "U-NEXT のエピソードが作品の一覧に見つかりませんでした。",
      );
    }
  }
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
