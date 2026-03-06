import type { Episode, SearchParam, SearchResult, Work } from "./types";
import { searchWorks } from "./util/annict";
import { extract, extractFullTitle } from "./util/extract/extract";
import { isSameTitle } from "./util/normalize";
import {
  findEpisodeByBracketTitle,
  findEpisodeByNumber,
  findEpisodeByNumberText,
  findEpisodeByTitle,
  findEpisodeByTitleAndNumberText,
  findEpisodeByTitleAsNumberText,
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

function isMatchingWorkTitle(
  work: { title: string; seriesList: string[] | undefined },
  targetWorkTitle: string,
): boolean {
  if (isSameTitle(work.title, targetWorkTitle)) {
    return true;
  }
  if (!work.seriesList) {
    return false;
  }
  return work.seriesList.some((series) =>
    isSameTitle(`${series} ${work.title}`, targetWorkTitle),
  );
}

// weak モードでタイトルが一致する作品を探す。複数一致する場合は誤マッチを防ぐため undefined を返す
function findUniqueWeakMatchWork(
  works: Work[],
  targetWorkTitle: string,
): Work | undefined {
  const matched = works.filter(
    (work) =>
      isSameTitle(work.title, targetWorkTitle, true) ||
      work.seriesList?.some((series) =>
        isSameTitle(`${series} ${work.title}`, targetWorkTitle, true),
      ),
  );
  return matched.length === 1 ? matched[0] : undefined;
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
    if (!isMatchingWorkTitle(work, target.workTitle)) {
      continue;
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
      findEpisodeByNumberText(work.episodes, target.episode) ??
      findEpisodeByTitleAsNumberText(work.episodes, target.episode);
    if (episode) {
      return {
        id: work.id,
        title: work.title,
        episode: episode,
      };
    }
  }
  // weak モードでワークタイトルが一致する作品に絞ってエピソードを探す（複数一致はスキップ）
  const weakMatchWork = findUniqueWeakMatchWork(works, target.workTitle);
  if (weakMatchWork) {
    if (weakMatchWork.noEpisodes) {
      return {
        id: weakMatchWork.id,
        title: weakMatchWork.title,
        episode: undefined,
      };
    }

    if (weakMatchWork.episodes && target.episode) {
      const episode =
        findEpisodeByTitle(weakMatchWork.episodes, target.episode) ??
        findEpisodeByNumberText(weakMatchWork.episodes, target.episode) ??
        findEpisodeByTitleAsNumberText(weakMatchWork.episodes, target.episode);
      if (episode) {
        return { id: weakMatchWork.id, title: weakMatchWork.title, episode };
      }
    }
  }

  // タイトルが一致する作品が見つからなかった場合、サブタイトルのみで検索
  if (target.episode) {
    // title + numberText が両方一致するエピソードを優先して探す
    for (const work of works) {
      if (work.noEpisodes || !work.episodes) {
        continue;
      }
      const episode = findEpisodeByTitleAndNumberText(
        work.episodes,
        target.episode,
      );
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

    // カッコ内の文字列のみで一致するエピソードを探す
    // e.g. "CLANNAD番外編 「夏休みの出来事」" → "夏休みの出来事" で検索
    for (const work of works) {
      if (work.noEpisodes || !work.episodes) {
        continue;
      }
      const episode = findEpisodeByBracketTitle(work.episodes, target.episode);
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

    // target.episode.title が work.title と一致する noEpisodes 作品を探す
    // e.g. workTitle="君に届け", episodeTitle="10分くらいで振り返る『君に届け』"
    //   → work.title="10分くらいで振り返る『君に届け』" に一致
    if (target.episode.title) {
      const episodeTitle = target.episode.title;
      const strictWork = works.find(
        (work) => work.noEpisodes && isSameTitle(work.title, episodeTitle),
      );
      if (strictWork) {
        return {
          id: strictWork.id,
          title: strictWork.title,
          episode: undefined,
        };
      }
      const weakWorks = works.filter(
        (work) =>
          work.noEpisodes && isSameTitle(work.title, episodeTitle, true),
      );
      if (weakWorks.length === 1) {
        return {
          id: weakWorks[0].id,
          title: weakWorks[0].title,
          episode: undefined,
        };
      }
    }

    // エピソードが見つからなかった場合、フルタイトルで検索
    const fullTitle = buildFullTitle(params);
    const strictWork = works.find(
      (work) => work.noEpisodes && isSameTitle(work.title, fullTitle),
    );
    if (strictWork) {
      return { id: strictWork.id, title: strictWork.title, episode: undefined };
    }

    const weakWorks = works.filter(
      (work) => work.noEpisodes && isSameTitle(work.title, fullTitle, true),
    );
    if (weakWorks.length === 1) {
      return {
        id: weakWorks[0].id,
        title: weakWorks[0].title,
        episode: undefined,
      };
    }

    // work.title & episode.number が一致するエピソードを探す
    for (const work of works) {
      if (work.noEpisodes || !work.episodes) {
        continue;
      }
      if (!isMatchingWorkTitle(work, target.workTitle)) {
        continue;
      }
      const episode = findEpisodeByNumber(work.episodes, target.episode);
      if (episode) {
        return { id: work.id, title: work.title, episode };
      }
    }
  }

  const targetFullTitle = buildFullTitle(params);

  // strict マッチ
  for (const work of works) {
    if (!work.episodes) continue;
    for (const episode of work.episodes) {
      const fullTitle = [work.title, episode.numberText, episode.title].join(
        "",
      );
      if (isSameTitle(fullTitle, targetFullTitle)) {
        return { id: work.id, title: work.title, episode };
      }
    }
  }

  // weak マッチ（1件のみ一致した場合）
  const weakMatches: { work: Work; episode: Episode }[] = [];
  for (const work of works) {
    if (!work.episodes) continue;
    for (const episode of work.episodes) {
      const fullTitle = [work.title, episode.numberText, episode.title].join(
        "",
      );
      if (isSameTitle(fullTitle, targetFullTitle, true)) {
        weakMatches.push({ work, episode });
      }
    }
  }
  if (weakMatches.length === 1) {
    const { work, episode } = weakMatches[0];
    return { id: work.id, title: work.title, episode };
  }
}
