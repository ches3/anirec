import { isRecorded, record } from "@anirec/annict";
import type { ContentScriptContext } from "#imports";
import type { WorkInfoData } from "@/types";
import { searchFromList } from "@/utils/search";
import { getRecordSettings, getToken } from "@/utils/settings";
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
			setRecordStatus({ status: "idle" }, ver);

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
		const days = recordSettings.preventDuplicateDays;

		if (days !== 0 && (await isRecorded(id, days, token))) {
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

		// 待機
		setRecordStatus({ status: "waiting" }, ver);
		await wait(recordSettings.timing, ctx);
		setRecordStatus({ status: "processing" }, ver);

		// 重複記録チェック(待機後)
		if (days !== 0 && (await isRecorded(id, days, token))) {
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
		if (error instanceof Error && error.message === "locationChange") {
			return;
		}

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
