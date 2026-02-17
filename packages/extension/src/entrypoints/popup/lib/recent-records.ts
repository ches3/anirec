import type { Activities } from "@anirec/annict";
import { viewerActivities } from "@anirec/annict";
import { getToken } from "@/utils/settings";

export type RecentRecordsState =
	| { status: "error" }
	| { status: "success"; data: Activities };

export async function getRecentRecords(
	cursor: string = "",
): Promise<RecentRecordsState> {
	try {
		const token = await getToken();
		if (!token) {
			return { status: "error" };
		}

		let nextCursor = cursor;

		for (let pageCount = 0; pageCount < 10; pageCount += 1) {
			const data = await viewerActivities(10, nextCursor, token);

			if (data.items.length > 0 || !data.cursor) {
				return { status: "success", data };
			}

			nextCursor = data.cursor;
		}

		return {
			status: "success",
			data: {
				items: [],
				cursor: nextCursor,
			},
		};
	} catch {
		return { status: "error" };
	}
}
