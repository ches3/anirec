import type { Activities } from "@anirec/annict";
import { useCallback, useEffect, useState } from "react";
import { getRecentRecords } from "../lib/recent-records";

export type LoadMoreResult = "ok" | "error" | "noop";

type RecentRecordsLoadState =
	| { status: "loading" }
	| { status: "error" }
	| {
			status: "success";
			items: Activities["items"];
			hasNext: boolean;
			isLoadingMore: boolean;
			handleLoadMore: () => Promise<LoadMoreResult>;
			removeItem: (id: string) => void;
	  };

export function useRecentRecords(): RecentRecordsLoadState {
	const [status, setStatus] =
		useState<RecentRecordsLoadState["status"]>("loading");
	const [items, setItems] = useState<Activities["items"]>([]);
	const [cursor, setCursor] = useState<Activities["cursor"]>(undefined);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const removeItem = useCallback((id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const handleLoadMore = useCallback(async () => {
		if (status !== "success" || !cursor || isLoadingMore) {
			return "noop";
		}

		setIsLoadingMore(true);
		const state = await getRecentRecords(cursor);
		setIsLoadingMore(false);

		if (state.status === "error") {
			return "error";
		}

		setItems((prev) => [...prev, ...state.data.items]);
		setCursor(state.data.cursor);
		return "ok";
	}, [cursor, isLoadingMore, status]);

	useEffect(() => {
		let mounted = true;

		void (async () => {
			const state = await getRecentRecords();
			if (!mounted) return;
			if (state.status === "error") {
				setStatus("error");
				return;
			}
			setItems(state.data.items);
			setCursor(state.data.cursor);
			setStatus("success");
		})();

		return () => {
			mounted = false;
		};
	}, []);

	if (status !== "success") {
		return { status };
	}

	return {
		status: "success",
		items,
		hasNext: cursor != null,
		isLoadingMore,
		handleLoadMore,
		removeItem,
	};
}
