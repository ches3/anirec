import type { SearchParam, SearchResult } from "./types";
import { searchWorks } from "./util/annict";
import { extract, extractFullTitle } from "./util/extract/extract";
import { isSameTitle } from "./util/normalize";
import {
	findEpisodeByNumberText,
	findEpisodeByTitle,
	findEpisodeByTitleAndNumberText,
} from "./util/search/find-episode";
import { variants } from "./util/search/variants";

function buildFullTitle(params: SearchParam): string {
	if ("title" in params) {
		return params.title;
	}
	if ("episodeNumber" in params) {
		return [params.workTitle, params.episodeNumber, params.episodeTitle]
			.filter(Boolean)
			.join(" ");
	}
	return [params.workTitle, params.episodeTitle].filter(Boolean).join(" ");
}

export async function search(
	params: SearchParam,
	token: string,
): Promise<SearchResult> {
	const target = extract(params);
	const words = variants(target.workTitle);
	const works = await searchWorks(words, token);

	for (const work of works) {
		// タイトルが一致しない場合はスキップ
		if (!isSameTitle(work.title, target.workTitle)) {
			if (!work.seriesList) {
				continue;
			}
			// "シリーズ名 タイトル"の形式で一致するか確認
			const series = work.seriesList.find((series) =>
				isSameTitle(`${series} ${work.title}`, target.workTitle),
			);
			if (!series) {
				continue;
			}
		}

		// 映画などのエピソードがない作品
		if (work.noEpisodes) {
			return {
				id: work.id,
				title: work.title,
				episode: undefined,
			};
		}

		// エピソードがない場合はスキップ
		if (!work.episodes || !target.episode) {
			continue;
		}

		// title or numberText が一致するエピソードを探す
		const episode =
			findEpisodeByTitle(work.episodes, target.episode) ??
			findEpisodeByNumberText(work.episodes, target.episode);
		if (episode) {
			return {
				id: work.id,
				title: work.title,
				episode: episode,
			};
		}
	}

	// タイトルが一致する作品が見つからなかった場合、サブタイトルのみで検索
	if (!target.episode) {
		return;
	}

	// title + numberText が両方一致するエピソードを優先して探す
	for (const work of works) {
		if (work.noEpisodes || !work.episodes) {
			continue;
		}
		const episode = findEpisodeByTitleAndNumberText(work.episodes, target.episode);
		if (episode) {
			return { id: work.id, title: work.title, episode };
		}
	}

	// titleのみが一致するエピソードを探す
	for (const work of works) {
		if (work.noEpisodes || !work.episodes) {
			continue;
		}
		const episode = findEpisodeByTitle(work.episodes, target.episode);
		if (episode) {
			return { id: work.id, title: work.title, episode };
		}
	}

	// OVA等でAnnictの作品タイトルにサブタイトルが含まれている場合の対応
	// Annictタイトルをパースして、episode.titleが一致するか確認
	for (const work of works) {
		if (!work.noEpisodes) {
			continue;
		}
		const parsed = extractFullTitle(work.title);
		if (
			parsed.episode?.title &&
			target.episode?.title &&
			isSameTitle(parsed.episode.title, target.episode.title, true)
		) {
			return {
				id: work.id,
				title: work.title,
				episode: undefined,
			};
		}
	}

	// エピソードが見つからなかった場合、フルタイトルで検索
	const fullTitle = buildFullTitle(params);
	for (const work of works) {
		if (!work.noEpisodes) {
			continue;
		}
		if (work.noEpisodes && isSameTitle(work.title, fullTitle)) {
			return {
				id: work.id,
				title: work.title,
				episode: undefined,
			};
		}
	}
}
