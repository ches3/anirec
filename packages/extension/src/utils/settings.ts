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

const defaultRecordTiming: RecordTiming = {
	type: "continued",
	continuedSeconds: 90,
	delaySeconds: 180,
};

export async function getRecordTiming() {
	const recordTiming = await storage.getItem<RecordTiming>("sync:recordTiming");
	if (recordTiming) {
		return recordTiming;
	}
	return defaultRecordTiming;
}

export async function saveRecordTiming(
	type: RecordTiming["type"] | undefined,
	continuedSeconds: number | undefined,
	delaySeconds: number | undefined,
) {
	const prevRecordTiming = await getRecordTiming();
	await storage.setItem<RecordTiming>("sync:recordTiming", {
		type: type !== undefined ? type : prevRecordTiming.type,
		continuedSeconds:
			continuedSeconds !== undefined
				? continuedSeconds
				: prevRecordTiming.continuedSeconds,
		delaySeconds:
			delaySeconds !== undefined ? delaySeconds : prevRecordTiming.delaySeconds,
	});
}

export type ServiceEnabled = {
	dmm: boolean;
	unext: boolean;
	abema: boolean;
	danime: boolean;
};

export async function getEnabledServices() {
	const enabled = await storage.getItem<ServiceEnabled>("sync:enabledServices");
	if (enabled) {
		return enabled;
	}
	return {
		dmm: true,
		unext: true,
		abema: true,
		danime: true,
	};
}

export async function saveEnabledServices(enabled: ServiceEnabled) {
	await storage.setItem<ServiceEnabled>("sync:enabledServices", {
		dmm: enabled.dmm,
		unext: enabled.unext,
		abema: enabled.abema,
		danime: enabled.danime,
	});
}

export async function getPreventDuplicateDays() {
	const days = await storage.getItem<number>("sync:preventDuplicateDays");
	if (days !== null) {
		return days;
	}
	return 7;
}

export async function savePreventDuplicateDays(days: number) {
	await storage.setItem<number>("sync:preventDuplicateDays", days);
}
