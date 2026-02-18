import type { Episode, ExtractedEpisode } from "../../types";
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

// number のみが一致するエピソード
export function findEpisodeByNumber(
  episodes: Episode[],
  target: ExtractedEpisode,
): Episode | undefined {
  return episodes.find(
    (episode) =>
      episode.number !== undefined &&
      target.number !== undefined &&
      episode.number === target.number,
  );
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
