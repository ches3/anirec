import type { AnnictEpisode, AnnictWork } from "./gql/generated";

export type SearchParam =
  | {
      title: string;
    }
  | {
      workTitle: string;
      episodeTitle: string;
    }
  | {
      workTitle: string;
      episodeNumber: string;
      episodeTitle: string;
    };

export type SearchResult =
  | {
      id: string;
      title: string;
      episode: Episode | undefined;
    }
  | undefined;

export type Work = {
  id: string;
  title: string;
  noEpisodes: boolean;
  episodes: Episode[] | undefined;
  seriesList: string[] | undefined;
};

export type Episode = {
  id: string;
  title: string | undefined;
  number: number | undefined;
  numberText: string | undefined;
};

export type Activities = {
  items: (
    | {
        __typename: "Record";
        id: string;
        createdAt: string;
        work: Pick<Work, "id" | "title">;
        episode: Pick<AnnictEpisode, "id" | "title" | "numberText">;
      }
    | {
        __typename: "Review";
        id: string;
        createdAt: string;
        work: Pick<AnnictWork, "id" | "title">;
      }
  )[];
  cursor: string | null | undefined;
};

export type ExtractedEpisode = {
  number: number | undefined;
  numberText: string | undefined;
  title: string | undefined;
};
