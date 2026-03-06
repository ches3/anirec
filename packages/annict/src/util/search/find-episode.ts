import type { Episode, ExtractedEpisode } from "../../types";
import { parseNumber } from "../extract/number";
import { isSameTitle } from "../normalize";

// strict → weak の順で検索し、weak は1件のみ一致した場合に返す
function findWithStrictOrWeak(
  episodes: Episode[],
  matchFn: (episode: Episode, weak: boolean) => boolean,
): Episode | undefined {
  const strict = episodes.find((ep) => matchFn(ep, false));
  if (strict) return strict;
  const weak = episodes.filter((ep) => matchFn(ep, true));
  return weak.length === 1 ? weak[0] : undefined;
}

// title のみが一致するエピソード
export function findEpisodeByTitle(
  episodes: Episode[],
  target: ExtractedEpisode,
): Episode | undefined {
  const title = target.title;
  if (!title) return undefined;
  return findWithStrictOrWeak(
    episodes,
    (ep, weak) => !!ep.title && isSameTitle(ep.title, title, weak),
  );
}

// numberText のみが一致するエピソード
export function findEpisodeByNumberText(
  episodes: Episode[],
  target: ExtractedEpisode,
): Episode | undefined {
  const numberText = target.numberText;
  if (!numberText) return undefined;
  return findWithStrictOrWeak(
    episodes,
    (ep, weak) =>
      !!ep.numberText && isSameTitle(ep.numberText, numberText, weak),
  );
}

// number のみが一致するエピソード（単独一致の場合のみ返す）
export function findEpisodeByNumber(
  episodes: Episode[],
  target: ExtractedEpisode,
): Episode | undefined {
  const targetNumber = target.number;
  if (targetNumber === undefined) {
    return undefined;
  }

  const matched = episodes.filter(
    (episode) =>
      (episode.number ?? parseNumber(episode.numberText ?? "")) ===
      targetNumber,
  );
  return matched.length === 1 ? matched[0] : undefined;
}

// title と numberText が両方一致するエピソード
export function findEpisodeByTitleAndNumberText(
  episodes: Episode[],
  target: ExtractedEpisode,
): Episode | undefined {
  const title = target.title;
  const numberText = target.numberText;
  if (!title || !numberText) return undefined;
  return findWithStrictOrWeak(
    episodes,
    (ep, weak) =>
      !!ep.title &&
      isSameTitle(ep.title, title, weak) &&
      !!ep.numberText &&
      isSameTitle(ep.numberText, numberText, weak),
  );
}

// target.title が ep.numberText と一致するエピソード
export function findEpisodeByTitleAsNumberText(
  episodes: Episode[],
  target: ExtractedEpisode,
): Episode | undefined {
  const title = target.title;
  if (!title) return undefined;
  return findWithStrictOrWeak(
    episodes,
    (ep, weak) => !!ep.numberText && isSameTitle(ep.numberText, title, weak),
  );
}

// 「」内の文字列を抽出する
function extractBracketContent(str: string): string | undefined {
  return str.match(/「([^」]+)」/)?.[1];
}

// カッコ内の文字列のみで一致するエピソード
export function findEpisodeByBracketTitle(
  episodes: Episode[],
  target: ExtractedEpisode,
): Episode | undefined {
  const title = target.title;
  if (!title) return undefined;

  const bracketContent = extractBracketContent(title);
  if (!bracketContent) return undefined;

  return findWithStrictOrWeak(
    episodes,
    (ep, weak) => !!ep.title && isSameTitle(ep.title, bracketContent, weak),
  );
}
