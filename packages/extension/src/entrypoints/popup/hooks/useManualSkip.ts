import { toast } from "sonner";
import type { ManualSkipMessage } from "@/types";

export function useManualSkip(tabId: number | null) {
  const manualSkip = async () => {
    if (tabId === null) return;
    try {
      await browser.tabs.sendMessage<ManualSkipMessage>(tabId, {
        type: "MANUAL_SKIP",
      });
    } catch {
      toast.error("スキップ処理に失敗しました。");
    }
  };

  return { manualSkip };
}
