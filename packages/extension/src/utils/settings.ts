import type { Vod } from "@/types";

export async function getToken() {
	const token =
		(await storage.getItem<string>("sync:token")) ||
		import.meta.env.WXT_ANNICT_TOKEN;
	return token;
}

export type RecordTiming = {
	type: "continued" | "delay" | "ended";
	continuedSeconds: number;
	delaySeconds: number;
};

export type ServiceEnabled = Record<Vod, boolean>;

export type RecordSettings = {
	timing: RecordTiming;
	enabledServices: ServiceEnabled;
	preventDuplicateDays: number;
};

export type RecordSettingsPatch = {
	timing?: Partial<RecordTiming>;
	enabledServices?: Partial<ServiceEnabled>;
	preventDuplicateDays?: number;
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
	};
}

const defaultRecordSettings: RecordSettings = {
	timing: {
		type: "continued",
		continuedSeconds: 90,
		delaySeconds: 180,
	},
	enabledServices: {
		dmm: true,
		unext: true,
		abema: true,
		danime: true,
	},
	preventDuplicateDays: 7,
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
