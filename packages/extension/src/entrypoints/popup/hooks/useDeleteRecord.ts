import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type {
	CancelDeleteMessage,
	DeleteResultMessage,
	ScheduleDeleteMessage,
} from "@/types";

export function useDeleteRecord(removeItem: (id: string) => void) {
	const [pendingDeletions, setPendingDeletions] = useState<Set<string>>(
		new Set(),
	);
	// refで最新のSetを保持し、クロージャ問題を回避
	const pendingRef = useRef(pendingDeletions);
	pendingRef.current = pendingDeletions;

	useEffect(() => {
		void browser.runtime
			.sendMessage({ type: "GET_PENDING_DELETIONS" })
			.then((response) => {
				if (response?.ids.length > 0) {
					setPendingDeletions(new Set(response.ids));
				}
			});
	}, []);

	useEffect(() => {
		const listener = (message: DeleteResultMessage) => {
			if (message.type !== "DELETE_RESULT") return;

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
		return () => browser.runtime.onMessage.removeListener(listener);
	}, [removeItem]);

	const scheduleDelete = useCallback((id: string) => {
		// 既に保留中の場合はスキップ
		if (pendingRef.current.has(id)) return;

		browser.runtime
			.sendMessage<ScheduleDeleteMessage>({
				type: "SCHEDULE_DELETE",
				id,
			})
			.then(() => setPendingDeletions((prev) => new Set(prev).add(id)))
			.catch(() => {
				toast.error("削除に失敗しました");
			});
	}, []);

	const cancelDelete = useCallback((id: string) => {
		if (!pendingRef.current.has(id)) return;

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
	}, []);

	return { scheduleDelete, cancelDelete, pendingDeletions };
}
