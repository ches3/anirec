import { record } from "@anirec/annict";
import type { ManualRecordResponse } from "@/types";
import { getToken } from "@/utils/settings";
import type { PageStateUpdater } from "../page-state";
import { createRecordError, getRecordErrorMessage } from "../record-error";

export async function handleManualRecord(
  id: string,
  state: PageStateUpdater,
): Promise<ManualRecordResponse> {
  try {
    const token = await getToken();
    if (!token) {
      return { ok: false, error: "Annictトークンが設定されていません。" };
    }

    state.setRecordStatus({ status: "processing" });

    await record(id, token).catch((error) => {
      throw createRecordError("annict_record_failed", error);
    });
    state.setRecordStatus({ status: "success" });
    return { ok: true };
  } catch (error) {
    const errorMessage = getRecordErrorMessage(error);
    state.setRecordStatus({ status: "error", errorMessage });
    return { ok: false, error: errorMessage };
  }
}
