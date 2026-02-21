import type { SearchResult } from "@anirec/annict";
import { isRecorded, record } from "@anirec/annict";
import type { RecordResult, SkipReason, Vod } from "@/types";
import { toError, toErrorMessage } from "@/utils/error";
import { getAutoRecordEnabled, getRecordSettings } from "@/utils/settings";
import { getVideoSelector, isVodEnabled } from "@/utils/vod";
import type { PageStateUpdater } from "../page-state";
import { wait } from "./wait";

type RecordGate = "proceed" | Exclude<SkipReason, "not_found">;

export type RunRecordFlowResult = RecordResult | { status: "locationChange" };

async function getRecordGate(
  vod: Vod,
  id: string,
  token: string,
): Promise<RecordGate> {
  if (!(await getAutoRecordEnabled())) {
    return "disabled";
  }

  const recordSettings = await getRecordSettings();

  if (!isVodEnabled(vod, recordSettings.enabledServices)) {
    return "service_disabled";
  }

  if (
    recordSettings.preventDuplicate.enabled &&
    (await isRecorded(id, recordSettings.preventDuplicate.days, token))
  ) {
    return "duplicate";
  }

  return "proceed";
}

export async function runRecordFlow(
  state: PageStateUpdater,
  vod: Vod,
  token: string,
  result: NonNullable<SearchResult>,
  signal: AbortSignal,
): Promise<RunRecordFlowResult> {
  try {
    // 記録条件チェック
    const id = result.episode?.id || result.id;
    const preWaitGate = await getRecordGate(vod, id, token);
    if (preWaitGate !== "proceed") {
      return { status: "skipped", skipReason: preWaitGate };
    }

    // 待機
    const { timing } = await getRecordSettings();
    const waitResult = await wait(
      timing,
      getVideoSelector(vod),
      (progress) => {
        state.setRecordStatus({ status: "waiting", progress });
      },
      signal,
    );
    const waitState = waitResult.status;
    if (waitState === "disabled") {
      return {
        status: "skipped",
        skipReason: "disabled",
      };
    }
    if (waitState !== "completed") {
      return { status: "locationChange" };
    }

    state.setRecordStatus({ status: "processing" });

    // 記録条件再チェック
    const postWaitGate = await getRecordGate(vod, id, token);
    if (postWaitGate !== "proceed") {
      return { status: "skipped", skipReason: postWaitGate };
    }

    // 記録
    await record(id, token).catch((error) => {
      throw toError("エピソードの記録に失敗しました。", error);
    });

    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      errorMessage: toErrorMessage(error),
    };
  }
}
