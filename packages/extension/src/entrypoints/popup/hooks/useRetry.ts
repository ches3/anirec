import { toast } from "sonner";
import type { RetryMessage } from "@/types";

export function useRetry(tabId: number | null) {
  const retry = async () => {
    if (tabId === null) return;
    try {
      await browser.tabs.sendMessage<RetryMessage>(tabId, { type: "RETRY" });
    } catch {
      toast.error("リトライ処理に失敗しました。");
    }
  };

  return { retry };
}
