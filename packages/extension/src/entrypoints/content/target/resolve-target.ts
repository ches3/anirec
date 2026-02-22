import type { SearchResult } from "@anirec/annict";
import type { WorkInfoData } from "@/types";
import { searchFromList } from "@/utils/search";
import { identifyVod } from "@/utils/vod";
import { createRecordError } from "../record-error";
import { extractSearchParams } from "./extract-search-params";

export type ResolveTargetResult =
  | { status: "no_vod" }
  | { status: "not_found"; workInfo: WorkInfoData }
  | {
      status: "found";
      workInfo: WorkInfoData;
      result: NonNullable<SearchResult>;
    };

export async function resolveTarget(
  token: string,
): Promise<ResolveTargetResult> {
  const url = new URL(location.href);
  const vod = identifyVod(url);
  if (!vod) {
    return { status: "no_vod" };
  }

  const searchParams = await extractSearchParams(vod, {
    url,
    queryRoot: document,
  }).catch((error) => {
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
