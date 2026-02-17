import { useEffect, useState } from "react";
import type {
	PageInfo,
	PageInfoUpdateMessage,
	RecordStatus,
	RecordStatusUpdateMessage,
	Vod,
} from "@/types";
import { identifyVod } from "@/utils/vod";
import { fetchPageState, getCurrentTabInfo } from "../lib/page-state";

const idlePageInfo: PageInfo = { status: "idle" };
const idleRecordStatus: RecordStatus = { status: "loading" };

export type PageStateResult = {
	error: string | null;
	pageInfo: PageInfo;
	recordStatus: RecordStatus;
	vod: Vod | undefined;
};

export function usePageState(): PageStateResult {
	const [tabId, setTabId] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [pageInfo, setPageInfo] = useState<PageInfo>({ status: "loading" });
	const [recordStatus, setRecordStatus] =
		useState<RecordStatus>(idleRecordStatus);
	const [vod, setVod] = useState<Vod | undefined>(undefined);

	// タブ情報取得 + 初期状態取得
	useEffect(() => {
		void (async () => {
			try {
				const { tabId, tabUrl } = await getCurrentTabInfo();
				setTabId(tabId);
				const currentVod = tabUrl ? identifyVod(tabUrl) : undefined;

				setVod(currentVod);

				if (!currentVod) {
					setPageInfo(idlePageInfo);
					setRecordStatus(idleRecordStatus);
					setError(null);
					return;
				}

				const pageState = await fetchPageState(tabId);

				setPageInfo(pageState.pageInfo);
				setRecordStatus(pageState.recordStatus);
				setError(null);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "作品情報の取得に失敗しました",
				);
				setPageInfo(idlePageInfo);
				setRecordStatus(idleRecordStatus);
			}
		})();
	}, []);

	// リアルタイム更新の監視（content -> popup）
	useEffect(() => {
		if (tabId === null) return;

		const handleMessage = (
			message: RecordStatusUpdateMessage | PageInfoUpdateMessage,
			sender: Browser.runtime.MessageSender,
		) => {
			if (sender.tab?.id !== tabId) {
				return;
			}

			if (message.type === "RECORD_STATUS_UPDATED") {
				setRecordStatus(message.recordStatus);
				setError(null);
			}
			if (message.type === "PAGE_INFO_UPDATED") {
				if (message.pageInfo.status === "ready") {
					setVod(message.pageInfo.workInfo.vod);
				} else if (sender.tab?.url) {
					setVod(identifyVod(sender.tab.url));
				}
				setError(null);
				setPageInfo(message.pageInfo);
			}
		};

		browser.runtime.onMessage.addListener(handleMessage);

		return () => {
			browser.runtime.onMessage.removeListener(handleMessage);
		};
	}, [tabId]);

	return { error, pageInfo, recordStatus, vod };
}
