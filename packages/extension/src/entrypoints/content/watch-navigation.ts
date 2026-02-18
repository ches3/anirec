import type { ContentScriptContext } from "#imports";
import type { Vod } from "@/types";
import { asyncQuerySelector } from "@/utils/async-query-selector";
import { waitForTextContent } from "@/utils/dom";

// 同一URLのままエピソードが切り替わる場合に監視が必要なVODのセレクタ定義
const MUTATION_KEY_SELECTORS: Partial<Record<Vod, string[]>> = {
  prime: [
    "#dv-web-player h1.atvwebplayersdk-title-text",
    "#dv-web-player h2.atvwebplayersdk-subtitle-text",
  ],
};

// MutationObserver を使って指定セレクタのテキスト変化を監視する。
// いずれかのセレクタのテキストが変化した時点で onChange を呼び出す。
// 全セレクタの要素が DOM に現れてテキストが設定されるまで待機してから監視を開始する。
async function observeMutation(
  signal: AbortSignal,
  onChange: () => void,
  keySelectors: string[],
): Promise<void> {
  if (signal.aborted) return;

  // 全セレクタの要素とテキストを待つ
  const targets = await Promise.all(
    keySelectors.map(async (sel) => {
      const elem = await asyncQuerySelector(sel, document);
      if (!elem) return;
      await waitForTextContent(elem);
      return { sel, elem };
    }),
  );

  if (signal.aborted) return;

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  // 監視
  const observers: MutationObserver[] = [];
  for (const target of targets) {
    if (!target) continue;
    const { sel, elem } = target;
    const { parentElement } = elem;
    if (!parentElement) continue;

    let lastText = elem.textContent?.trim() ?? "";

    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const currentText =
          document.querySelector(sel)?.textContent?.trim() ?? "";
        if (currentText === lastText) return;
        lastText = currentText;
        onChange();
      }, 200);
    });

    observer.observe(parentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    observers.push(observer);
  }

  signal.addEventListener(
    "abort",
    () => {
      for (const observer of observers) {
        observer.disconnect();
      }
      clearTimeout(debounceTimer);
    },
    { once: true },
  );
}

// locationchange と DOM 変化監視を統合したページ遷移検知。
// vod を渡すと、同一URLのままエピソードが切り替わる場合も検知する。
export function watchNavigation(
  ctx: ContentScriptContext,
  onNavigate: () => void,
  vod?: Vod,
): void {
  const keySelectors = vod ? MUTATION_KEY_SELECTORS[vod] : undefined;
  let mutationAbort: AbortController | undefined;

  const startMutation = () => {
    if (!keySelectors) return;
    mutationAbort = new AbortController();
    void observeMutation(mutationAbort.signal, handleNavigate, keySelectors);
  };

  const handleNavigate = () => {
    // DOM 変化監視を再起動（ページ遷移後に DOM が再構築されるため）
    mutationAbort?.abort();
    startMutation();
    onNavigate();
  };

  startMutation();
  ctx.addEventListener(window, "wxt:locationchange", handleNavigate);
}
