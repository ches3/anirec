import { deleteActivity } from "@anirec/annict";
import type {
  CancelDeleteMessage,
  DeleteResultMessage,
  GetPendingDeletionsMessage,
  ScheduleDeleteMessage,
} from "@/types";
import { getAutoRecordEnabled, getToken } from "@/utils/settings";

function updateActionIcon(enabled: boolean) {
  const dir = enabled ? "/icon" : "/icon/gray";
  void browser.action.setIcon({
    path: {
      16: `${dir}/16.png`,
      32: `${dir}/32.png`,
      48: `${dir}/48.png`,
      96: `${dir}/96.png`,
      128: `${dir}/128.png`,
    },
  });
}

export default defineBackground(async () => {
  const enabled = await getAutoRecordEnabled();
  updateActionIcon(enabled);

  storage.watch<boolean>("local:autoRecordEnabled", (newValue) => {
    updateActionIcon(newValue ?? true);
  });

  const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();
  const sendDeleteResult = (message: DeleteResultMessage) => {
    void browser.runtime.sendMessage<DeleteResultMessage>(message).catch(() => {
      // popup未起動時は受信者不在になるため通知失敗を許容する
    });
  };

  browser.runtime.onMessage.addListener(
    (
      message: GetPendingDeletionsMessage,
      _sender,
      sendResponse: (response: { ids: string[] }) => void,
    ) => {
      if (message.type !== "GET_PENDING_DELETIONS") return;
      sendResponse({ ids: [...pendingTimers.keys()] });
    },
  );

  browser.runtime.onMessage.addListener(
    (message: ScheduleDeleteMessage | CancelDeleteMessage) => {
      if (message.type === "SCHEDULE_DELETE") {
        const { id } = message;
        const existingTimer = pendingTimers.get(id);
        if (existingTimer !== undefined) {
          clearTimeout(existingTimer);
        }
        const timer = setTimeout(async () => {
          pendingTimers.delete(id);
          try {
            const token = await getToken();
            if (!token) {
              sendDeleteResult({
                type: "DELETE_RESULT",
                id,
                ok: false,
              });
              return;
            }

            await deleteActivity(id, token);
            sendDeleteResult({
              type: "DELETE_RESULT",
              id,
              ok: true,
            });
          } catch {
            sendDeleteResult({
              type: "DELETE_RESULT",
              id,
              ok: false,
            });
          }
        }, 5000);
        pendingTimers.set(id, timer);
      }

      if (message.type === "CANCEL_DELETE") {
        const timer = pendingTimers.get(message.id);
        if (timer !== undefined) {
          clearTimeout(timer);
          pendingTimers.delete(message.id);
        }
      }
    },
  );
});
