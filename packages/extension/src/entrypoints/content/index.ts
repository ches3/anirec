import { getToken } from "@/utils/settings";
import { identifyVod } from "@/utils/vod";
import {
  bumpStateVer,
  createStateUpdater,
  getCurrentStateVer,
  getPageStateResponse,
  type PageStateUpdater,
} from "./page-state";
import { createAbortBinding, waitUntilAutoRecordEnabled } from "./record/abort";
import { handleManualRecord } from "./record/manual-record";
import { handleManualSkip } from "./record/manual-skip";
import { runRecordFlow } from "./record/run-record";
import { getRecordErrorMessage } from "./record-error";
import { resolveVod } from "./resolve-vod";
import { resolveTarget } from "./target/resolve-target";
import { watchNavigation } from "./watch-navigation";

export default defineContentScript({
  matches: [
    "*://tv.dmm.com/*",
    "*://video.unext.jp/*",
    "*://abema.tv/*",
    "*://animestore.docomo.ne.jp/*",
    "*://www.amazon.co.jp/*",
    "*://www.netflix.com/*",
  ],
  main(ctx) {
    let currentScriptAbort: AbortController | undefined;

    const triggerScript = () => {
      currentScriptAbort?.abort();
      currentScriptAbort = new AbortController();
      const state = createStateUpdater(bumpStateVer());
      state.setPageInfo({ status: "loading" });
      state.setRecordStatus({ status: "loading" });
      void script(state, currentScriptAbort.signal);
    };

    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === "GET_PAGE_STATE") {
        sendResponse(getPageStateResponse());
        return;
      }
      if (message.type === "MANUAL_RECORD") {
        currentScriptAbort?.abort();
        const state = createStateUpdater(getCurrentStateVer());
        handleManualRecord(message.id, state).then(sendResponse);
        return true;
      }
      if (message.type === "MANUAL_SKIP") {
        currentScriptAbort?.abort();
        handleManualSkip();
        sendResponse();
        return;
      }
      if (message.type === "RETRY") {
        triggerScript();
        sendResponse();
        return;
      }
    });

    const vod = identifyVod(new URL(location.href));
    watchNavigation(ctx, triggerScript, vod);
    triggerScript();
  },
});

async function script(state: PageStateUpdater, navigationSignal: AbortSignal) {
  try {
    const url = new URL(location.href);
    const vod = await resolveVod(url, document);
    if (!vod) {
      state.setPageInfo({ status: "no_vod" });
      return;
    }

    const token = await getToken();
    if (!token) {
      state.setPageInfo({ status: "no_token" });
      state.setRecordStatus({
        status: "error",
        errorMessage: "Annictトークンが設定されていません。",
      });
      return;
    }

    state.setPageInfo({ status: "loading" });
    const targetResult = await resolveTarget(token, vod, url);

    if (targetResult.status === "not_found") {
      const { workInfo } = targetResult;
      state.setPageInfo({ status: "not_found", workInfo });
      state.setRecordStatus({ status: "skipped", skipReason: "not_found" });
      return;
    }

    const { workInfo, result } = targetResult;
    state.setPageInfo({ status: "found", workInfo, annictInfo: result });

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
      errorMessage: getRecordErrorMessage(error),
    });
    console.error(error);
  }
}
