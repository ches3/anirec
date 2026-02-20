import { toErrorMessage } from "@/utils/error";
import { getToken } from "@/utils/settings";
import { identifyVod } from "@/utils/vod";
import {
  bumpStateVer,
  createStateUpdater,
  getPageStateResponse,
  type PageStateUpdater,
} from "./page-state";
import { createAbortBinding, waitUntilAutoRecordEnabled } from "./record/abort";
import { runRecordFlow } from "./record/run-record";
import { resolveTarget } from "./target/resolve-target";
import { watchNavigation } from "./watch-navigation";

export default defineContentScript({
  matches: [
    "*://tv.dmm.com/*",
    "*://video.unext.jp/*",
    "*://abema.tv/*",
    "*://animestore.docomo.ne.jp/*",
    "*://www.amazon.co.jp/gp/video/*",
  ],
  main(ctx) {
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === "GET_PAGE_STATE") {
        sendResponse(getPageStateResponse());
      }
    });

    let currentScriptAbort: AbortController | undefined;

    const triggerScript = () => {
      currentScriptAbort?.abort();
      currentScriptAbort = new AbortController();
      const state = createStateUpdater(bumpStateVer());
      state.setPageInfo({ status: "idle" });
      state.setRecordStatus({ status: "loading" });
      void script(state, currentScriptAbort.signal);
    };

    const vod = identifyVod(new URL(location.href));
    watchNavigation(ctx, triggerScript, vod);
    triggerScript();
  },
});

async function script(state: PageStateUpdater, navigationSignal: AbortSignal) {
  try {
    const token = await getToken();
    if (!token) {
      state.setPageInfo({ status: "idle" });
      state.setRecordStatus({
        status: "error",
        errorMessage: "Annictトークンが設定されていません。",
      });
      console.error("Annictトークンが設定されていません。");
      return;
    }

    state.setPageInfo({ status: "loading" });
    const targetResult = await resolveTarget(token);

    if (targetResult.status === "no_vod") {
      state.setPageInfo({ status: "idle" });
      return;
    }

    if (targetResult.status === "not_found") {
      const { workInfo } = targetResult;
      state.setPageInfo({ status: "ready", workInfo, annictInfo: undefined });
      state.setRecordStatus({ status: "skipped", skipReason: "not_found" });
      return;
    }

    const { workInfo, result } = targetResult;
    state.setPageInfo({ status: "ready", workInfo, annictInfo: result });

    while (!navigationSignal.aborted) {
      state.setRecordStatus({ status: "loading" });
      const abortBinding = createAbortBinding(navigationSignal);
      if (!abortBinding) {
        return;
      }

      const recordResult = await runRecordFlow(
        state,
        workInfo.vod,
        token,
        result,
        abortBinding.signal,
      ).finally(() => {
        abortBinding.dispose();
      });

      if (recordResult.status === "locationChange") {
        return;
      }

      state.setRecordStatus(recordResult);
      if (
        recordResult.status === "skipped" &&
        recordResult.skipReason === "disabled"
      ) {
        const enabled = await waitUntilAutoRecordEnabled(navigationSignal);
        if (!enabled) {
          return;
        }
        continue;
      }
      return;
    }
  } catch (error) {
    state.setRecordStatus({
      status: "error",
      errorMessage: toErrorMessage(error),
    });
    if (error instanceof Error) {
      console.error(error);
    }
  }
}
