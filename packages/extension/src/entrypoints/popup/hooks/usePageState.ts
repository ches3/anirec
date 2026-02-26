import { useEffect, useState } from "react";
import type {
  PageInfo,
  PageInfoUpdateMessage,
  RecordStatus,
  RecordStatusUpdateMessage,
} from "@/types";
import { identifyVod } from "@/utils/vod";
import { fetchPageState, getCurrentTabInfo } from "../lib/page-state";

const noVodPageInfo: PageInfo = { status: "no_vod" };
const idleRecordStatus: RecordStatus = { status: "loading" };

export type PageStateResult = {
  error: string | null;
  pageInfo: PageInfo;
  recordStatus: RecordStatus;
  tabId: number | null;
};

export function usePageState(): PageStateResult {
  const [tabId, setTabId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ status: "loading" });
  const [recordStatus, setRecordStatus] =
    useState<RecordStatus>(idleRecordStatus);

  // タブ情報取得 + 初期状態取得
  useEffect(() => {
    void (async () => {
      try {
        const { tabId, tabUrl } = await getCurrentTabInfo();
        setTabId(tabId);
        const vod = tabUrl ? identifyVod(tabUrl) : undefined;
        if (!vod) {
          setPageInfo(noVodPageInfo);
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
        setPageInfo(noVodPageInfo);
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
        setError(null);
        setPageInfo(message.pageInfo);
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [tabId]);

  return { error, pageInfo, recordStatus, tabId };
}
