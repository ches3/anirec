import type { Episode, ExtractedEpisode } from "../../types";
import { isSameTitle } from "../normalize";

// title のみが一致するエピソード
export function findEpisodeByTitle(
	episodes: Episode[],
	target: ExtractedEpisode,
): Episode | undefined {
	return episodes.find(
		(episode) =>
			episode.title &&
			target.title &&
			isSameTitle(episode.title, target.title, true),
	);
}

// numberText のみが一致するエピソード
export function findEpisodeByNumberText(
	episodes: Episode[],
	target: ExtractedEpisode,
): Episode | undefined {
	return episodes.find(
		(episode) =>
			episode.numberText &&
			target.numberText &&
			isSameTitle(episode.numberText, target.numberText, true),
	);
}

// title と numberText が両方一致するエピソード
export function findEpisodeByTitleAndNumberText(
	episodes: Episode[],
	target: ExtractedEpisode,
): Episode | undefined {
	return episodes.find(
		(episode) =>
			episode.title &&
			target.title &&
			isSameTitle(episode.title, target.title, true) &&
			episode.numberText &&
			target.numberText &&
			isSameTitle(episode.numberText, target.numberText, true),
	);
}
