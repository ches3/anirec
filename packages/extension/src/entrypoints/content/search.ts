import { type SearchResult, search } from "@anirec/annict";
import type { Title } from "@/types";

export const searchFromList = async (
	list: Title[],
	token: string,
): Promise<SearchResult> => {
	for (const title of list) {
		const result = await search(title, token);
		if (result) {
			return result;
		}
	}
};
