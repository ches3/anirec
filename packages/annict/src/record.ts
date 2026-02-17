import {
	createRecord,
	createReview,
	deleteRecord,
	deleteReview,
	viewerActivities,
} from "./util/annict";
import { toAnnictId } from "./utils";

export async function record(id: string, token: string): Promise<void> {
	const annictId = toAnnictId(id);

	if (annictId.type === "work") {
		await createReview(id, token);
	} else if (annictId.type === "episode") {
		await createRecord(id, token);
	} else {
		throw new Error(`Invalid id: ${id}`);
	}
}

export async function deleteActivity(id: string, token: string): Promise<void> {
	const annictId = toAnnictId(id);

	if (annictId.type === "record") {
		await deleteRecord(id, token);
	} else if (annictId.type === "review") {
		await deleteReview(id, token);
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
