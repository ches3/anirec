import type { SearchResult } from "@anirec/annict";
import type { WorkInfoData } from "@/types";
import { toError } from "@/utils/error";
import { searchFromList } from "@/utils/search";
import { identifyVod } from "@/utils/vod";
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
    throw toError("タイトルの取得に失敗しました。", error);
  });

  if (!searchParams) {
    throw new Error("タイトルの取得に失敗しました。");
  }

  console.log("タイトル情報", searchParams);

  const result = await searchFromList(searchParams, token).catch((error) => {
    throw toError("エピソードの検索に失敗しました。", error);
  });

  const workInfo: WorkInfoData = { vod, searchParams };

  if (!result) {
    console.error("エピソードが見つかりませんでした。", {
      titleList: searchParams,
    });
    return { status: "not_found", workInfo };
  }

  return { status: "found", workInfo, result };
}
