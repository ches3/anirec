import { getAutoRecordEnabled, watchAutoRecordEnabled } from "@/utils/settings";

export type AbortBinding = {
  signal: AbortSignal;
  dispose: () => void;
};

export async function waitUntilAutoRecordEnabled(
  navigationSignal: AbortSignal,
): Promise<boolean> {
  if (navigationSignal.aborted) {
    return false;
  }
  if (await getAutoRecordEnabled()) {
    return true;
  }

  return await new Promise<boolean>((resolve) => {
    if (navigationSignal.aborted) {
      resolve(false);
      return;
    }

    let settled = false;

    const cleanup = () => {
      navigationSignal.removeEventListener("abort", onAbort);
      unwatchAutoRecordEnabled();
    };

    const resolveOnce = (value: boolean) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve(value);
    };

    const onAbort = () => resolveOnce(false);
    navigationSignal.addEventListener("abort", onAbort, { once: true });
    const unwatchAutoRecordEnabled = watchAutoRecordEnabled((newValue) => {
      if (newValue) {
        resolveOnce(true);
      }
    });
  });
}

export function createAbortBinding(
  navigationSignal: AbortSignal,
): AbortBinding | null {
  if (navigationSignal.aborted) {
    return null;
  }

  const abortController = new AbortController();
  const onAbort = () => abortController.abort("locationChange");
  navigationSignal.addEventListener("abort", onAbort, { once: true });
  const unwatchAutoRecordEnabled = watchAutoRecordEnabled((newValue) => {
    if (!newValue) {
      abortController.abort("disabled");
    }
  });

  const dispose = () => {
    navigationSignal.removeEventListener("abort", onAbort);
    unwatchAutoRecordEnabled();
  };

  return {
    signal: abortController.signal,
    dispose,
  };
}
