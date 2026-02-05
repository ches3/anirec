import type { Episode, ExtractedEpisode } from "../../types";
import { isSameTitle } from "../normalize";

export function findEpisode(
	episodes: Episode[],
	target: ExtractedEpisode,
	weak?: boolean,
): Episode | undefined {
	// タイトルが一致するエピソード
	const episodeByTitle = episodes.find(
		(episode) =>
			episode.title &&
			target.title &&
			isSameTitle(episode.title, target.title, true),
	);
	if (episodeByTitle) {
		return episodeByTitle;
	}

	// weakがtrueの場合、numberTextが一致するエピソードを探す
	if (weak === false) {
		return;
	}
	const episodeByNumberText = episodes.find(
		(episode) =>
			episode.numberText &&
			target.numberText &&
			isSameTitle(episode.numberText, target.numberText, true),
	);
	if (episodeByNumberText) {
		return episodeByNumberText;
	}

	// 誤検出を避けるため、numberによる一致は行わない
}
