import { isRecorded, record, search } from "@ches3/annict-search";
import type { ContentScriptContext } from "wxt/client";
import { getTitle } from "./get-title";
import { wait } from "./wait";

export default defineContentScript({
	matches: ["*://tv.dmm.com/*", "*://video.unext.jp/*", "*://abema.tv/*"],
	main(ctx) {
		script(ctx);
		ctx.addEventListener(window, "wxt:locationchange", () => {
			console.log("locationchange");
			script(ctx);
		});
	},
});

async function script(ctx: ContentScriptContext) {
	const token = await getToken();
	if (!token) {
		console.error("Annictトークンが設定されていません。");
		return;
	}

	// URLを検証
	if (!isPlayPage(location.href)) {
		return;
	}

	// タイトルを取得
	console.log("play page");
	const title = await getTitle(location.hostname).catch((e) => {
		console.error("タイトルの取得に失敗しました。", e);
		return;
	});
	if (!title) {
		console.error("タイトルの取得に失敗しました。");
		return;
	}
	console.log("タイトル情報", title);

	// 待機
	console.log("start waiting");
	const recordTiming = await getRecordTiming();
	await wait(recordTiming, ctx);
	console.log("end waiting");

	// エピソードを検索
	const result = await search(
		{ workTitle: title.work, episodeTitle: title.episode },
		token,
	).catch((e) => {
		console.error("エピソードの検索に失敗しました。", e);
		return;
	});
	if (!result) {
		console.error("エピソードが見つかりませんでした。", title);
		return;
	}

	// エピソードを記録
	const id = result.episode?.id || result.id;
	if (await isRecorded(id, 7, token)) {
		console.log("このエピソードは記録済みです。", result);
		return;
	}
	await record(id, token).catch((e) => {
		console.error("エピソードの記録に失敗しました。", e);
		return;
	});
	console.log("エピソードを記録しました。", result);
}
