import type { ContentScriptContext } from "#imports";
import type { Vod } from "@/types";

export async function getToken() {
  const token =
    (await storage.getItem<string>("sync:token")) ||
    import.meta.env.WXT_ANNICT_TOKEN;
  return token;
}

export type RecordTiming = {
  type: "continued" | "ended";
  continuedSeconds: number;
};

export type ServiceEnabled = Record<Vod, boolean>;

export type PreventDuplicate = {
  enabled: boolean;
  days: number;
};

export type RecordSettings = {
  timing: RecordTiming;
  enabledServices: ServiceEnabled;
  preventDuplicate: PreventDuplicate;
};

export type RecordSettingsPatch = {
  timing?: Partial<RecordTiming>;
  enabledServices?: Partial<ServiceEnabled>;
  preventDuplicate?: Partial<PreventDuplicate>;
};

export function mergeRecordSettings(
  base: RecordSettings,
  incoming?: RecordSettingsPatch,
): RecordSettings {
  return {
    ...base,
    ...(incoming ?? {}),
    timing: {
      ...base.timing,
      ...(incoming?.timing ?? {}),
    },
    enabledServices: {
      ...base.enabledServices,
      ...(incoming?.enabledServices ?? {}),
    },
    preventDuplicate: {
      ...base.preventDuplicate,
      ...(incoming?.preventDuplicate ?? {}),
    },
  };
}

const defaultRecordSettings: RecordSettings = {
  timing: {
    type: "continued",
    continuedSeconds: 60,
  },
  enabledServices: {
    dmm: true,
    unext: true,
    abema: true,
    danime: true,
  },
  preventDuplicate: {
    enabled: true,
    days: 7,
  },
};

export async function getRecordSettings() {
  const settings = await storage.getItem<RecordSettings>("sync:recordSettings");
  if (!settings) {
    return defaultRecordSettings;
  }
  return mergeRecordSettings(defaultRecordSettings, settings);
}

export async function saveRecordSettings(settings: RecordSettings) {
  await storage.setItem<RecordSettings>("sync:recordSettings", settings);
}

export async function getAutoRecordEnabled(): Promise<boolean> {
  return (await storage.getItem<boolean>("local:autoRecordEnabled")) ?? true;
}

export async function saveAutoRecordEnabled(enabled: boolean): Promise<void> {
  await storage.setItem<boolean>("local:autoRecordEnabled", enabled);
}

export function watchAutoRecordEnabled(
  ctx: ContentScriptContext,
  callback: (newValue: boolean) => void,
): () => void {
  const unwatchStorage = storage.watch<boolean>(
    "local:autoRecordEnabled",
    (newValue) => callback(newValue ?? true),
  );

  function cleanup() {
    unwatchStorage();
    window.removeEventListener("wxt:locationchange", onLocationChange);
  }

  const onLocationChange = () => cleanup();
  ctx.addEventListener(window, "wxt:locationchange", onLocationChange);

  return cleanup;
}
