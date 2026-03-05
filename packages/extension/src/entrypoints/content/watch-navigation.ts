import type { ContentScriptContext } from "#imports";
import type { Vod } from "@/types";

// 同一URLのままエピソードが切り替わる場合にポーリングが必要なVODのセレクタ定義
const POLL_KEY_SELECTORS: Partial<Record<Vod, string[]>> = {
  prime: [
    ".dv-player-fullscreen h1.atvwebplayersdk-title-text",
    ".dv-player-fullscreen h2.atvwebplayersdk-subtitle-text",
  ],
};

// setInterval を使って指定セレクタ群のテキスト変化を監視する。
// 全セレクタのテキストを結合したキーが変化した場合に onChange を呼び出す。
function pollSelectorTextChange(
  signal: AbortSignal,
  onChange: () => void,
  selectors: string[],
): void {
  if (signal.aborted) return;

  const getSelectorTextKey = () =>
    selectors
      .map((sel) => document.querySelector(sel)?.textContent?.trim() ?? "")
      .join("\0");

  let lastKey = getSelectorTextKey();

  const timer = setInterval(() => {
    const key = getSelectorTextKey();
    if (key === lastKey) return;
    lastKey = key;
    onChange();
  }, 500);

  signal.addEventListener("abort", () => clearInterval(timer), { once: true });
}

// locationchange と DOM 変化監視を統合したページ遷移検知。
// vod を渡すと、同一URLのままエピソードが切り替わる場合も検知する。
export function watchNavigation(
  ctx: ContentScriptContext,
  onNavigate: () => void,
  vod?: Vod,
): void {
  const pollSelectors = vod ? POLL_KEY_SELECTORS[vod] : undefined;
  let pollAbort: AbortController | undefined;

  const startPolling = () => {
    if (!pollSelectors) return;
    pollAbort = new AbortController();
    pollSelectorTextChange(pollAbort.signal, handleNavigate, pollSelectors);
  };

  const handleNavigate = () => {
    pollAbort?.abort();
    startPolling();
    onNavigate();
  };

  startPolling();
  ctx.addEventListener(window, "wxt:locationchange", handleNavigate);
}
