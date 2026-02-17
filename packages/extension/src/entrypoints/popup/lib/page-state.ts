import type { PageStateData, PageStateMessage } from "@/types";

export type CurrentTabInfo = {
  tabId: number;
  tabUrl: string | undefined;
};

export async function getCurrentTabInfo(): Promise<CurrentTabInfo> {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (typeof tab?.id !== "number") {
    throw new Error("アクティブなタブが見つかりませんでした。");
  }

  return {
    tabId: tab.id,
    tabUrl: tab?.url,
  };
}

/**
 * 指定タブからページ状態を取得
 */
export async function fetchPageState(tabId: number): Promise<PageStateData> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    // Content scriptへメッセージ送信（タイムアウト付き）
    const timeoutPromise = new Promise<PageStateData>((_resolve, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("タイムアウト: ページからの応答がありませんでした。"));
      }, 5000);
    });

    const response = await Promise.race<PageStateData>([
      browser.tabs.sendMessage<PageStateMessage, PageStateData>(tabId, {
        type: "GET_PAGE_STATE",
      }),
      timeoutPromise,
    ]);

    return response;
  } catch (error) {
    console.error("Failed to fetch page state:", error);

    // Content scriptが読み込まれていない場合
    if (
      error instanceof Error &&
      error.message.includes("Receiving end does not exist")
    ) {
      throw new Error("ページを再読み込みしてください。");
    }

    throw new Error(
      error instanceof Error ? error.message : "不明なエラーが発生しました。",
    );
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
