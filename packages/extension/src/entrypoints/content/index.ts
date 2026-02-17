import { isRecorded, record, type SearchResult } from "@anirec/annict";
import type { ContentScriptContext } from "#imports";
import type { Vod, WorkInfoData } from "@/types";
import { asyncQuerySelector } from "@/utils/async-query-selector";
import { searchFromList } from "@/utils/search";
import {
  getAutoRecordEnabled,
  getRecordSettings,
  getToken,
  watchAutoRecordEnabled,
} from "@/utils/settings";
import { identifyVod, isVodEnabled } from "@/utils/vod";
import { extractSearchParams } from "./extract-search-params";
import {
  bumpStateVer,
  getPageStateResponse,
  setPageInfo,
  setRecordStatus,
} from "./page-state";
import { wait } from "./wait";

async function getWorkInfoFromPage(): Promise<WorkInfoData | null> {
  const url = new URL(location.href);
  const vod = identifyVod(url);

  if (!vod) {
    return null;
  }

  const searchParams = await extractSearchParams(vod, {
    url,
    queryRoot: document,
  }).catch((e) => {
    if (e instanceof Error) {
      throw new Error("タイトルの取得に失敗しました。", { cause: e });
    }
    throw new Error("タイトルの取得に失敗しました。");
  });

  if (!searchParams) {
    throw new Error("タイトルの取得に失敗しました。");
  }

  return {
    vod,
    searchParams,
  };
}

type Prefetched = {
  vod: Vod;
  token: string;
  result: NonNullable<SearchResult>;
};

// enabled が true になったタイミングで scriptFromRecordSettings を再実行するウォッチャーを設定する
function watchForReEnable(
  ctx: ContentScriptContext,
  ver: number,
  prefetched: Prefetched,
) {
  const unwatch = watchAutoRecordEnabled(ctx, (newValue) => {
    if (newValue) {
      unwatch();
      setRecordStatus({ status: "loading" }, ver);
      void scriptFromRecordSettings(ctx, ver, prefetched);
    }
  });
}

export default defineContentScript({
  matches: [
    "*://tv.dmm.com/*",
    "*://video.unext.jp/*",
    "*://abema.tv/*",
    "*://animestore.docomo.ne.jp/*",
  ],
  main(ctx) {
    // メッセージリスナーを追加
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === "GET_PAGE_STATE") {
        sendResponse(getPageStateResponse());
        return;
      }
    });

    const initialVer = bumpStateVer();
    void script(ctx, initialVer);
    ctx.addEventListener(window, "wxt:locationchange", () => {
      const ver = bumpStateVer();

      // ページ遷移時に状態をリセット
      setPageInfo({ status: "idle" }, ver);
      setRecordStatus({ status: "loading" }, ver);

      void script(ctx, ver);
    });
  },
});

async function script(ctx: ContentScriptContext, ver: number) {
  try {
    const currentWorkInfo = await getWorkInfoFromPage();
    if (!currentWorkInfo) {
      setPageInfo({ status: "idle" }, ver);
      return;
    }

    const { vod, searchParams: titleList } = currentWorkInfo;
    setPageInfo({ status: "loading" }, ver);

    const token = await getToken();
    if (!token) {
      setPageInfo({ status: "idle" }, ver);

      setRecordStatus(
        {
          status: "error",
          errorMessage: "Annictトークンが設定されていません。",
        },
        ver,
      );
      console.error("Annictトークンが設定されていません。");
      return;
    }

    console.log("タイトル情報", titleList);

    const result = await searchFromList(titleList, token).catch((e) => {
      if (e instanceof Error) {
        throw new Error("エピソードの検索に失敗しました。", { cause: e });
      }
    });

    setPageInfo(
      {
        status: "ready",
        workInfo: currentWorkInfo,
        annictInfo: result || undefined,
      },
      ver,
    );

    if (!result) {
      setRecordStatus(
        {
          status: "skipped",
          skipReason: "not_found",
        },
        ver,
      );
      console.error("エピソードが見つかりませんでした。", { titleList });
      return;
    }

    const autoRecordEnabled = await getAutoRecordEnabled();
    if (!autoRecordEnabled) {
      setRecordStatus(
        {
          status: "skipped",
          skipReason: "disabled",
        },
        ver,
      );
      // enabled が true に変わったら待機を開始する
      watchForReEnable(ctx, ver, { vod, token, result });
      return;
    }

    await scriptFromRecordSettings(ctx, ver, { vod, token, result });
  } catch (error) {
    // エラー状態に更新
    setRecordStatus(
      {
        status: "error",
        errorMessage: error instanceof Error ? error.message : "不明なエラー",
      },
      ver,
    );
    if (error instanceof Error) {
      console.error(error);
    }
  }
}

async function scriptFromRecordSettings(
  ctx: ContentScriptContext,
  ver: number,
  { vod, token, result }: Prefetched,
) {
  const abortController = new AbortController();
  const unwatch = watchAutoRecordEnabled(ctx, (newValue) => {
    if (!newValue) {
      unwatch();
      abortController.abort("disabled");
    }
  });
  ctx.addEventListener(window, "wxt:locationchange", () => {
    abortController.abort("locationChange");
  });

  try {
    const recordSettings = await getRecordSettings();
    if (!isVodEnabled(vod, recordSettings.enabledServices)) {
      setRecordStatus(
        {
          status: "skipped",
          skipReason: "service_disabled",
        },
        ver,
      );
      return;
    }

    // 重複記録チェック(待機前)
    const id = result.episode?.id || result.id;
    const { preventDuplicate } = recordSettings;

    if (
      preventDuplicate.enabled &&
      (await isRecorded(id, preventDuplicate.days, token))
    ) {
      setRecordStatus(
        {
          status: "skipped",
          skipReason: "duplicate",
        },
        ver,
      );
      console.log("このエピソードは記録済みです。", result);
      return;
    }

    // video要素を取得
    const videoElem = await asyncQuerySelector("video", document, 0);
    if (!(videoElem instanceof HTMLVideoElement)) {
      throw new Error("video要素の取得に失敗しました。");
    }

    // 待機
    setRecordStatus({ status: "waiting", progress: 0 }, ver);
    const waitResult = await wait(
      recordSettings.timing,
      videoElem,
      (progress) => {
        setRecordStatus({ status: "waiting", progress }, ver);
      },
      abortController.signal,
    );

    if (waitResult.status === "aborted") {
      if (waitResult.reason === "disabled") {
        setRecordStatus(
          {
            status: "skipped",
            skipReason: "disabled",
          },
          ver,
        );
        // enabled が true に変わったら待機を再開する
        watchForReEnable(ctx, ver, { vod, token, result });
      }
      return;
    }

    setRecordStatus({ status: "processing" }, ver);

    // 重複記録チェック(待機後)
    if (
      preventDuplicate.enabled &&
      (await isRecorded(id, preventDuplicate.days, token))
    ) {
      setRecordStatus(
        {
          status: "skipped",
          skipReason: "duplicate",
        },
        ver,
      );
      console.log("このエピソードは記録済みです。", result);
      return;
    }

    // 記録
    await record(id, token).catch((e) => {
      if (e instanceof Error) {
        throw new Error("エピソードの記録に失敗しました。", { cause: e });
      }
    });
    setRecordStatus({ status: "success" }, ver);

    console.log("エピソードを記録しました。", result);
  } catch (error) {
    // エラー状態に更新
    setRecordStatus(
      {
        status: "error",
        errorMessage: error instanceof Error ? error.message : "不明なエラー",
      },
      ver,
    );
    if (error instanceof Error) {
      console.error(error);
    }
  } finally {
    unwatch();
  }
}
