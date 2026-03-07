import type { SearchTarget } from "../../types";

export function buildFullTitle(target: SearchTarget): string {
  return [
    target.workTitle,
    target.episode?.numberText?.trim(),
    target.episode?.title?.trim(),
  ]
    .filter(Boolean)
    .join(" ");
}
