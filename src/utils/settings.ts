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
