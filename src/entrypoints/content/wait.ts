import type { ContentScriptContext } from "wxt/client";
import { asyncQuerySelector } from "./async-query-selector";

export function wait(
	whenRecord: "delay" | "ended" | "continued",
	ctx: ContentScriptContext,
) {
	if (whenRecord === "delay") {
		return waitDelay(180, ctx);
	}
	if (whenRecord === "ended") {
		return waitEnded("video");
	}
	if (whenRecord === "continued") {
		return waitContinued(90, "video", ctx);
	}
}

function waitDelay(waitSecond: number, ctx: ContentScriptContext) {
	return new Promise<void>((resolve, reject) => {
		const timeout = setTimeout(resolve, waitSecond * 1000);
		ctx.addEventListener(window, "wxt:locationchange", () => {
			clearTimeout(timeout);
			return reject();
		});
	});
}

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

			ctx.addEventListener(window, "wxt:locationchange", () => {
				cleanup();
				return reject();
			});
		});
	});
}
