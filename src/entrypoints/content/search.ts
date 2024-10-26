import { type SearchResult, search } from "@ches3/annict-search";

export const searchFromList = async (
	list: Title[],
	token: string,
): Promise<SearchResult> => {
	for (const title of list) {
		console.log("searching", title);
		const result = await search(title, token);
		if (result) {
			return result;
		}
	}
};
