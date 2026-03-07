import type { SearchTarget } from "../../types";
import { isSameTitle } from "../normalize";
import { mappingRules } from "./mapping-rules";

export function applyMapping(target: SearchTarget): SearchTarget {
  const mapped: SearchTarget = {
    workTitle: target.workTitle,
    episode: target.episode ? { ...target.episode } : undefined,
  };

  const rule = mappingRules.find((candidate) =>
    candidate.workTitleFrom.some((title) =>
      isSameTitle(mapped.workTitle, title),
    ),
  );
  if (!rule) {
    return mapped;
  }

  // workTitle変換
  if (rule.workTitleTo) {
    mapped.workTitle = rule.workTitleTo;
  }

  const episodeMappings = rule.episodeMappings;
  if (!episodeMappings) {
    return mapped;
  }

  if (!mapped.episode) {
    return mapped;
  }

  const targetEpisodeTitle = mapped.episode.title;
  if (!targetEpisodeTitle) {
    return mapped;
  }

  // episodeTitle変換
  for (const episodeMapping of episodeMappings) {
    if (
      episodeMapping.episodeTitleFrom.some((title) =>
        isSameTitle(targetEpisodeTitle, title),
      )
    ) {
      mapped.episode.title = episodeMapping.episodeTitleTo;
      return mapped;
    }
  }

  return mapped;
}
