import type { ContentScriptContext } from "#imports";
import type { RecordTiming } from "@/utils/settings";

export function wait(
	recordTiming: RecordTiming,
	videoElem: HTMLVideoElement,
	ctx: ContentScriptContext,
	onProgress?: (progress: number) => void,
) {
	if (recordTiming.type === "delay") {
		return waitDelay(recordTiming.delaySeconds, videoElem, ctx, onProgress);
	}
	if (recordTiming.type === "ended") {
		return waitEnded(videoElem, ctx, onProgress);
	}
	if (recordTiming.type === "continued") {
		return waitContinued(
			recordTiming.continuedSeconds,
			videoElem,
			ctx,
			onProgress,
		);
	}
	throw new Error("記録タイミングの値が不正です");
}

// 再生開始まで待機
function waitPlaying(elem: HTMLVideoElement) {
	return new Promise<void>((resolve) => {
		if (!elem.paused) {
			return resolve();
		}
		const onPlaying = () => {
			elem.removeEventListener("playing", onPlaying);
			return resolve();
		};
		elem.addEventListener("playing", onPlaying);
	});
}

// 再生開始からn秒待機
function waitDelay(
	waitSecond: number,
	videoElem: HTMLVideoElement,
	ctx: ContentScriptContext,
	onProgress?: (progress: number) => void,
) {
	return new Promise<void>((resolve, reject) => {
		// 再生開始まで待機
		waitPlaying(videoElem).then(() => {
			let elapsed = 0;
			onProgress?.(0);

			const interval = setInterval(() => {
				elapsed += 1;
				onProgress?.(Math.min(elapsed / waitSecond, 1));
			}, 1000);

			const timeout = setTimeout(() => {
				clearInterval(interval);
				resolve();
			}, waitSecond * 1000);

			// ページ遷移時にクリーンアップ & reject
			ctx.addEventListener(window, "wxt:locationchange", () => {
				clearTimeout(timeout);
				clearInterval(interval);
				return reject(new Error("locationChange"));
			});
		});
	});
}

// 再生終了まで待機
function waitEnded(
	videoElem: HTMLVideoElement,
	ctx: ContentScriptContext,
	onProgress?: (progress: number) => void,
) {
	return new Promise<void>((resolve, reject) => {
		const interval = setInterval(() => {
			if (
				onProgress &&
				Number.isFinite(videoElem.duration) &&
				videoElem.duration > 0
			) {
				onProgress(videoElem.currentTime / videoElem.duration);
			}
		}, 1000);

		const onEnded = () => {
			clearInterval(interval);
			videoElem.removeEventListener("ended", onEnded);
			onProgress?.(1);
			return resolve();
		};
		videoElem.addEventListener("ended", onEnded);

		// ページ遷移時にクリーンアップ & reject
		ctx.addEventListener(window, "wxt:locationchange", () => {
			clearInterval(interval);
			videoElem.removeEventListener("ended", onEnded);
			return reject(new Error("locationChange"));
		});
	});
}

// 合計n秒間再生されるまで待機 (一時停止中はカウントしない)
function waitContinued(
	waitSecond: number,
	videoElem: HTMLVideoElement,
	ctx: ContentScriptContext,
	onProgress?: (progress: number) => void,
) {
	return new Promise<void>((resolve, reject) => {
		let totalTime = 0;

		const interval = setInterval(() => {
			if (videoElem.paused) {
				return;
			}
			totalTime += 1;
			onProgress?.(Math.min(totalTime / waitSecond, 1));
			if (totalTime >= waitSecond) {
				clearInterval(interval);
				return resolve();
			}
		}, 1000);

		// ページ遷移時にクリーンアップ & reject
		ctx.addEventListener(window, "wxt:locationchange", () => {
			clearInterval(interval);
			return reject(new Error("locationChange"));
		});
	});
}
