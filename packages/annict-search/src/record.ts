import { createRecord, createReview, viewerActivities } from "./util/annict";

function getType(id: string): "episode" | "work" | "invalid" {
	try {
		const decoded = atob(id);
		if (decoded.match(/^Work-[\d]+$/)) {
			return "work";
		}
		if (decoded.match(/^Episode-[\d]+$/)) {
			return "episode";
		}
		return "invalid";
	} catch (e) {
		if (e instanceof DOMException) {
			if (e.name === "InvalidCharacterError") {
				return "invalid";
			}
		}
		throw e;
	}
}

export async function record(id: string, token: string): Promise<void> {
	const type = getType(id);

	if (type === "work") {
		await createReview(id, token);
	} else if (type === "episode") {
		await createRecord(id, token);
	} else {
		throw new Error(`Invalid id: ${id}`);
	}
}

export async function isRecorded(
	id: string,
	daysAgo: number,
	token: string,
): Promise<boolean> {
	if (daysAgo < 1) {
		throw new Error("daysAgo must be greater than 0");
	}

	let currentDate = new Date();
	const endDate = new Date();
	endDate.setDate(currentDate.getDate() - daysAgo);

	let before = "";
	const records: string[] = [];

	while (currentDate > endDate) {
		const { items, cursor } = await viewerActivities(30, before, token);
		for (const item of items) {
			currentDate = new Date(item.createdAt);
			if (currentDate <= endDate) {
				break;
			}
			if (item.__typename === "Record") {
				records.push(item.episode.id);
			} else if (item.__typename === "Review") {
				records.push(item.work.id);
			}
		}
		if (!cursor) {
			break;
		}
		before = cursor;
	}
	return records.includes(id);
}
