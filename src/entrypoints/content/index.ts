import { isPlayPage } from "@/utils/is-play-page";
import { getRecordTiming, getToken } from "@/utils/settings";
import { isRecorded, record } from "@ches3/annict-search";
import type { ContentScriptContext } from "wxt/client";
import { getTitleList } from "./get-title";
import { searchFromList } from "./search";
import { wait } from "./wait";

export default defineContentScript({
	matches: [
		"*://tv.dmm.com/*",
		"*://video.unext.jp/*",
		"*://abema.tv/*",
		"*://animestore.docomo.ne.jp/*",
	],
	main(ctx) {
		script(ctx).catch((e) => {
			if (e instanceof Error && e.message !== "locationChange") {
				console.error(e);
			}
		});
		ctx.addEventListener(window, "wxt:locationchange", () => {
			console.log("locationchange");
			script(ctx).catch((e) => {
				if (e instanceof Error && e.message !== "locationChange") {
					console.error(e);
				}
			});
		});
	},
});

async function script(ctx: ContentScriptContext) {
	const token = await getToken();
	if (!token) {
		throw new Error("Annictトークンが設定されていません。");
	}

	// URLを検証
	if (!isPlayPage(location.href)) {
		return;
	}

	// タイトルを取得
	console.log("play page");
	const titleList = await getTitleList(location.hostname).catch((e) => {
		if (e instanceof Error) {
			throw new Error("タイトルの取得に失敗しました。", e);
		}
	});
	if (!titleList) {
		throw new Error("タイトルの取得に失敗しました。");
	}
	console.log("タイトル情報", titleList);

	// 待機
	console.log("start waiting");
	const recordTiming = await getRecordTiming();
	await wait(recordTiming, ctx);
	console.log("end waiting");

	// エピソードを検索
	const result = await searchFromList(titleList, token).catch((e) => {
		if (e instanceof Error) {
			throw new Error("エピソードの検索に失敗しました。", e);
		}
	});
	if (!result) {
		throw new Error("エピソードが見つかりませんでした。");
	}

	// エピソードを記録
	const id = result.episode?.id || result.id;
	if (await isRecorded(id, 7, token)) {
		console.log("このエピソードは記録済みです。", result);
		return;
	}
	await record(id, token).catch((e) => {
		if (e instanceof Error) {
			throw new Error("エピソードの記録に失敗しました。", e);
		}
	});
	console.log("エピソードを記録しました。", result);
}
