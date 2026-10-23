import { search } from "@anirec/annict";
import type { SearchParam, SearchResult } from "@anirec/annict";

export const searchFromList = async (list: SearchParam[], token: string): Promise<SearchResult> => {
  for (const title of list) {
    const result = await search(title, token);
    if (result) {
      return result;
    }
  }
};
