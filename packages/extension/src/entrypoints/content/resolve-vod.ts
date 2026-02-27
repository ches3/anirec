import type { Vod } from "@/types";
import { asyncQuerySelector } from "@/utils/async-query-selector";
import { waitForTextContent } from "@/utils/dom";
import { identifyVod } from "@/utils/vod";

async function isPrimePlaybackPage(
  root: ParentNode = document,
): Promise<boolean> {
  const titleElem = await asyncQuerySelector(
    "#dv-web-player h1.atvwebplayersdk-title-text",
    root,
  );
  if (!titleElem) return false;
  const workTitle = await waitForTextContent(titleElem);
  return workTitle !== undefined;
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
