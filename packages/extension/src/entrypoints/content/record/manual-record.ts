import { record } from "@anirec/annict";
import type { ManualRecordResponse } from "@/types";
import { getToken } from "@/utils/settings";
import { getCurrentStateVer, setRecordStatus } from "../page-state";
import { createRecordError, getRecordErrorMessage } from "../record-error";

export async function handleManualRecord(
  id: string,
): Promise<ManualRecordResponse> {
  const token = await getToken();
  if (!token) {
    return { ok: false, error: "Annictトークンが設定されていません。" };
  }

  const ver = getCurrentStateVer();
  setRecordStatus({ status: "processing" }, ver);

  try {
    await record(id, token).catch((error) => {
      throw createRecordError("annict_record_failed", error);
    });
    setRecordStatus({ status: "success" }, ver);
    return { ok: true };
  } catch (error) {
    const errorMessage = getRecordErrorMessage(error);
    setRecordStatus({ status: "error", errorMessage }, ver);
    return { ok: false, error: errorMessage };
  }
}
