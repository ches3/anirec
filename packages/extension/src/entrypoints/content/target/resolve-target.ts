import type { SearchResult } from "@anirec/annict";
import type { Vod, WorkInfoData } from "@/types";
import { searchFromList } from "@/utils/search";
import { createRecordError } from "../record-error";
import { extractSearchParams } from "./extract-search-params";

export type ResolveTargetResult =
  | { status: "not_found"; workInfo: WorkInfoData }
  | {
      status: "found";
      workInfo: WorkInfoData;
      result: NonNullable<SearchResult>;
    };

export async function resolveTarget(
  token: string,
  vod: Vod,
  url: URL,
): Promise<ResolveTargetResult> {
  const searchParams = await extractSearchParams(vod, url).catch((error) => {
    throw createRecordError("search_params_extract_failed", error);
  });

  const result = await searchFromList(searchParams, token).catch((error) => {
    throw createRecordError("annict_search_failed", error);
  });

  const workInfo: WorkInfoData = { vod, searchParams };

  if (!result) {
    return { status: "not_found", workInfo };
  }

  return { status: "found", workInfo, result };
}
