import type { Vod } from "@/types";
import { asyncQuerySelector } from "@/utils/async-query-selector";
import { identifyVod } from "@/utils/vod";

async function isPrimePlaybackPage(
  root: ParentNode = document,
): Promise<boolean> {
  const element = await asyncQuerySelector("#dv-web-player", root);
  return element !== undefined;
}

export async function resolveVod(
  url: string | URL,
  root: ParentNode = document,
): Promise<Vod | undefined> {
  const vod = identifyVod(url);
  if (!vod) {
    return;
  }
  if (vod === "prime" && !(await isPrimePlaybackPage(root))) {
    return;
  }
  return vod;
}
