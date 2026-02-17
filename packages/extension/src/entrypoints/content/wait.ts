import type { RecordTiming } from "@/utils/settings";

export type WaitAbortReason = "locationChange" | "disabled";

export type WaitResult =
	| { status: "completed" }
	| { status: "aborted"; reason: WaitAbortReason };

const waitCompletedResult: WaitResult = { status: "completed" };

function createAbortedResult(reason: unknown): WaitResult {
	if (reason === "locationChange") {
		return { status: "aborted", reason };
	}
	return { status: "aborted", reason: "disabled" };
}

export function wait(
	recordTiming: RecordTiming,
	videoElem: HTMLVideoElement,
	onProgress?: (progress: number) => void,
	signal?: AbortSignal,
) {
	if (recordTiming.type === "delay") {
		return waitDelay(recordTiming.delaySeconds, videoElem, onProgress, signal);
	}
	if (recordTiming.type === "ended") {
		return waitEnded(videoElem, onProgress, signal);
	}
	if (recordTiming.type === "continued") {
		return waitContinued(
			recordTiming.continuedSeconds,
			videoElem,
			onProgress,
			signal,
		);
	}
	throw new Error("記録タイミングの値が不正です");
}

// 再生開始まで待機
function waitPlaying(elem: HTMLVideoElement, signal?: AbortSignal) {
	return new Promise<WaitResult>((resolve) => {
		if (signal?.aborted) {
			resolve(createAbortedResult(signal.reason));
			return;
		}

		const onAbort = () => {
			elem.removeEventListener("playing", onPlaying);
			resolve(createAbortedResult(signal?.reason));
		};

		if (!elem.paused) {
			resolve(waitCompletedResult);
			return;
		}

		const onPlaying = () => {
			signal?.removeEventListener("abort", onAbort);
			resolve(waitCompletedResult);
		};

		signal?.addEventListener("abort", onAbort, { once: true });
		elem.addEventListener("playing", onPlaying, { once: true });
	});
}

// 再生開始からn秒待機
function waitDelay(
	waitSecond: number,
	videoElem: HTMLVideoElement,
	onProgress?: (progress: number) => void,
	signal?: AbortSignal,
) {
	return new Promise<WaitResult>((resolve) => {
		if (signal?.aborted) {
			resolve(createAbortedResult(signal.reason));
			return;
		}

		let interval: ReturnType<typeof setInterval> | undefined;
		let timeout: ReturnType<typeof setTimeout> | undefined;
		let settled = false;

		const cleanup = () => {
			clearTimeout(timeout);
			clearInterval(interval);
			signal?.removeEventListener("abort", onAbort);
		};

		const resolveOnce = (result: WaitResult) => {
			if (settled) {
				return;
			}
			settled = true;
			cleanup();
			resolve(result);
		};

		const onAbort = () => {
			resolveOnce(createAbortedResult(signal?.reason));
		};
		signal?.addEventListener("abort", onAbort, { once: true });

		// 再生開始まで待機
		waitPlaying(videoElem, signal).then((playingResult) => {
			if (playingResult.status === "aborted") {
				resolveOnce(playingResult);
				return;
			}

			if (signal?.aborted) {
				resolveOnce(createAbortedResult(signal.reason));
				return;
			}

			let elapsed = 0;
			onProgress?.(0);

			interval = setInterval(() => {
				elapsed += 1;
				onProgress?.(Math.min(elapsed / waitSecond, 1));
			}, 1000);

			timeout = setTimeout(() => {
				resolveOnce(waitCompletedResult);
			}, waitSecond * 1000);
		});
	});
}

// 再生終了まで待機
function waitEnded(
	videoElem: HTMLVideoElement,
	onProgress?: (progress: number) => void,
	signal?: AbortSignal,
) {
	return new Promise<WaitResult>((resolve) => {
		if (signal?.aborted) {
			resolve(createAbortedResult(signal.reason));
			return;
		}

		let settled = false;

		const cleanup = () => {
			clearInterval(interval);
			videoElem.removeEventListener("ended", onEnded);
			signal?.removeEventListener("abort", onAbort);
		};

		const resolveOnce = (result: WaitResult) => {
			if (settled) {
				return;
			}
			settled = true;
			cleanup();
			resolve(result);
		};

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
			onProgress?.(1);
			resolveOnce(waitCompletedResult);
		};
		videoElem.addEventListener("ended", onEnded);

		const onAbort = () => {
			resolveOnce(createAbortedResult(signal?.reason));
		};
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}

// 合計n秒間再生されるまで待機 (一時停止中はカウントしない)
function waitContinued(
	waitSecond: number,
	videoElem: HTMLVideoElement,
	onProgress?: (progress: number) => void,
	signal?: AbortSignal,
) {
	return new Promise<WaitResult>((resolve) => {
		if (signal?.aborted) {
			resolve(createAbortedResult(signal.reason));
			return;
		}

		let totalTime = 0;
		let settled = false;

		const cleanup = () => {
			clearInterval(interval);
			signal?.removeEventListener("abort", onAbort);
		};

		const resolveOnce = (result: WaitResult) => {
			if (settled) {
				return;
			}
			settled = true;
			cleanup();
			resolve(result);
		};

		const interval = setInterval(() => {
			if (videoElem.paused) {
				return;
			}
			totalTime += 1;
			onProgress?.(Math.min(totalTime / waitSecond, 1));
			if (totalTime >= waitSecond) {
				resolveOnce(waitCompletedResult);
			}
		}, 1000);

		const onAbort = () => {
			resolveOnce(createAbortedResult(signal?.reason));
		};
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
