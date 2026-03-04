import { asyncQuerySelector, getTextContent } from "@/entrypoints/content/dom";
import type { Vod } from "@/types";
import { identifyVod } from "@/utils/vod";

async function isPrimePlaybackPage(): Promise<boolean> {
  const titleElem = await asyncQuerySelector(
    "#dv-web-player h1.atvwebplayersdk-title-text",
  );
  if (!titleElem) return false;
  const workTitle = await getTextContent(titleElem);
  return workTitle !== undefined;
}

export async function resolveVod(url: string | URL): Promise<Vod | undefined> {
  const vod = identifyVod(url);
  if (!vod) {
    return;
  }
  if (vod === "prime" && !(await isPrimePlaybackPage())) {
    return;
  }
  return vod;
}
