import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import type {
  CancelDeleteMessage,
  DeleteResultMessage,
  GetPendingDeletionsMessage,
  PageInfoUpdateMessage,
  RecordStatusUpdateMessage,
  ScheduleDeleteMessage,
} from "@/types";

export function useDeleteRecord(removeItem: (id: string) => void) {
  const [pendingDeletions, setPendingDeletions] = useState<Set<string>>(new Set());

  useEffect(() => {
    void browser.runtime
      .sendMessage<GetPendingDeletionsMessage, { ids: string[] } | undefined>({
        type: "GET_PENDING_DELETIONS",
      })
      .then((response) => {
        if (response !== undefined && response.ids.length > 0) {
          setPendingDeletions(new Set(response.ids));
        }
      });
  }, []);

  useEffect(() => {
    const listener = (
      message: DeleteResultMessage | PageInfoUpdateMessage | RecordStatusUpdateMessage,
    ) => {
      if (message.type !== "DELETE_RESULT") {
        return;
      }

      setPendingDeletions((prev) => {
        const next = new Set(prev);
        next.delete(message.id);
        return next;
      });

      if (message.ok) {
        removeItem(message.id);
      } else {
        toast.error("削除に失敗しました");
      }
    };

    browser.runtime.onMessage.addListener(listener);
    return () => {
      browser.runtime.onMessage.removeListener(listener);
    };
  }, [removeItem]);

  const scheduleDelete = useCallback(
    (id: string) => {
      // 既に保留中の場合はスキップ
      if (pendingDeletions.has(id)) {
        return;
      }

      browser.runtime
        .sendMessage<ScheduleDeleteMessage>({
          type: "SCHEDULE_DELETE",
          id,
        })
        .then(() => {
          setPendingDeletions((prev) => new Set(prev).add(id));
        })
        .catch(() => {
          toast.error("削除に失敗しました");
        });
    },
    [pendingDeletions],
  );

  const cancelDelete = useCallback(
    (id: string) => {
      if (!pendingDeletions.has(id)) {
        return;
      }

      browser.runtime
        .sendMessage<CancelDeleteMessage>({
          type: "CANCEL_DELETE",
          id,
        })
        .then(() => {
          setPendingDeletions((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        })
        .catch(() => {
          toast.error("削除キャンセルに失敗しました");
        });
    },
    [pendingDeletions],
  );

  return { scheduleDelete, cancelDelete, pendingDeletions };
}
