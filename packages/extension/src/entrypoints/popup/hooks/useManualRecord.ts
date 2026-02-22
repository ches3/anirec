import { useState } from "react";
import { toast } from "sonner";
import type { ManualRecordMessage, ManualRecordResponse } from "@/types";

export function useManualRecord(tabId: number | null) {
  const [isRecording, setIsRecording] = useState(false);

  const manualRecord = async (id: string) => {
    if (tabId === null || isRecording) return;

    setIsRecording(true);
    try {
      const response = await browser.tabs.sendMessage<
        ManualRecordMessage,
        ManualRecordResponse
      >(tabId, { type: "MANUAL_RECORD", id });

      if (!response.ok) {
        toast.error(response.error);
      }
    } catch {
      toast.error("記録に失敗しました。");
    } finally {
      setIsRecording(false);
    }
  };

  return { manualRecord, isRecording };
}
