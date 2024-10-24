import type { ContentScriptContext } from "wxt/client";
import { asyncQuerySelector } from "./async-query-selector";

export function wait(recordTiming: RecordTiming, ctx: ContentScriptContext) {
	console.log("recordTiming", recordTiming);
	if (recordTiming.type === "delay") {
		return waitDelay(recordTiming.delaySeconds, ctx);
	}
	if (recordTiming.type === "ended") {
		return waitEnded("video");
	}
	if (recordTiming.type === "continued") {
		return waitContinued(recordTiming.continuedSeconds, "video", ctx);
	}
	throw new Error("記録タイミングの値が不正です");
}

// 再生開始からn秒待機
function waitDelay(waitSecond: number, ctx: ContentScriptContext) {
	return new Promise<void>((resolve, reject) => {
		const timeout = setTimeout(resolve, waitSecond * 1000);

		// ページ遷移時にクリーンアップ & reject
		ctx.addEventListener(window, "wxt:locationchange", () => {
			clearTimeout(timeout);
			return reject();
		});
	});
}

// 再生終了まで待機
function waitEnded(selector: string) {
	return new Promise<void>((resolve, reject) => {
		asyncQuerySelector(selector).then((elem) => {
			if (!elem || !(elem instanceof HTMLVideoElement)) {
				return reject(new Error("video要素の取得に失敗しました"));
			}

			const onEnded = () => {
				elem.removeEventListener("ended", onEnded);
				return resolve();
			};
			elem.addEventListener("ended", onEnded);
		});
	});
}

// n秒間再生され続けるまで待機 (一時停止したら秒数リセット)
function waitContinued(
	waitSecond: number,
	selector: string,
	ctx: ContentScriptContext,
) {
	return new Promise<void>((resolve, reject) => {
		asyncQuerySelector(selector).then((elem) => {
			if (!elem || !(elem instanceof HTMLVideoElement)) {
				return reject(new Error("video要素の取得に失敗しました"));
			}

			let startTime = elem.currentTime;

			const resetTime = () => {
				startTime = elem.currentTime;
			};

			const cleanup = () => {
				clearInterval(interval);
				elem.removeEventListener("pause", resetTime);
				elem.removeEventListener("seeked", resetTime);
			};

			elem.addEventListener("pause", resetTime);
			elem.addEventListener("seeked", resetTime);

			const interval = setInterval(() => {
				console.log("interval");
				const playTime = elem.currentTime - startTime;
				if (playTime > waitSecond) {
					cleanup();
					return resolve();
				}
			}, 1000);

			// ページ遷移時にクリーンアップ & reject
			ctx.addEventListener(window, "wxt:locationchange", () => {
				cleanup();
				return reject();
			});
		});
	});
}
