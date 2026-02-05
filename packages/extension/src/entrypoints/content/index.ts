import { isRecorded, record } from "@anirec/annict";
import type { ContentScriptContext } from "#imports";
import { searchFromList } from "@/utils/search";
import {
	getEnabledServices,
	getPreventDuplicateDays,
	getRecordTiming,
	getToken,
} from "@/utils/settings";
import { identifyVod, isVodEnabled } from "@/utils/vod";
import { extractSearchParams } from "./extract-search-params";
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
			script(ctx).catch((e) => {
				if (e instanceof Error && e.message !== "locationChange") {
					console.error(e);
				}
			});
		});
	},
});

async function script(ctx: ContentScriptContext) {
	const url = new URL(location.href);
	const vod = identifyVod(url);
	if (!vod) {
		return;
	}

	const enabled = await getEnabledServices();
	if (!isVodEnabled(vod, enabled)) {
		return;
	}

	const token = await getToken();
	if (!token) {
		throw new Error("Annictトークンが設定されていません。");
	}

	// タイトルを取得
	const titleList = await extractSearchParams(vod, {
		url,
		queryRoot: document,
	}).catch((e) => {
		if (e instanceof Error) {
			throw new Error("タイトルの取得に失敗しました。", e);
		}
	});
	if (!titleList) {
		throw new Error("タイトルの取得に失敗しました。");
	}
	console.log("タイトル情報", titleList);

	// 待機
	const recordTiming = await getRecordTiming();
	await wait(recordTiming, ctx);

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
	const days = await getPreventDuplicateDays();
	if (days && (await isRecorded(id, days, token))) {
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
