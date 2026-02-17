import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import type { SearchParam } from "../types";
import { fetchNode, searchWorks } from "../util/annict";
import { extract } from "../util/extract/extract";
import { variants } from "../util/search/variants";
import type { AnnictTarget, Expected, Fixture, ParamPattern } from "./types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

/** 数値ID を Global ID (base64) に変換 */
function toGlobalId(type: "Work" | "Episode", id: string): string {
  return Buffer.from(`${type}-${id}`).toString("base64");
}

function parseAnnictUrl(url: string): AnnictTarget {
  const parsed = new URL(url);
  if (parsed.host !== "annict.com") {
    throw new Error(`Invalid host: ${parsed.host}, expected annict.com`);
  }

  const episodeMatch = parsed.pathname.match(
    /^\/works\/(\d+)\/episodes\/(\d+)$/,
  );
  if (episodeMatch) {
    return {
      type: "Episode",
      workId: episodeMatch[1],
      episodeId: episodeMatch[2],
    };
  }

  const workMatch = parsed.pathname.match(/^\/works\/(\d+)$/);
  if (workMatch) {
    return { type: "Work", workId: workMatch[1] };
  }

  throw new Error(`Invalid Annict URL path: ${parsed.pathname}`);
}

function trimSearchParam(params: SearchParam): SearchParam {
  if ("title" in params) {
    return { title: params.title.trim() };
  }
  if ("episodeNumber" in params) {
    return {
      workTitle: params.workTitle.trim(),
      episodeNumber: params.episodeNumber.trim(),
      episodeTitle: params.episodeTitle.trim(),
    };
  }
  return {
    workTitle: params.workTitle.trim(),
    episodeTitle: params.episodeTitle.trim(),
  };
}

function generateFilename(
  parsedUrl: AnnictTarget,
  params: SearchParam,
): string {
  const values: string[] = [];
  if ("title" in params) {
    values.push(params.title);
  } else if ("episodeNumber" in params) {
    values.push(params.workTitle, params.episodeNumber, params.episodeTitle);
  } else {
    values.push(params.workTitle, params.episodeTitle);
  }

  const slug = values
    .join("_")
    .replace(/[\\/:*?"<>|.\s]+/g, "")
    .slice(0, 80);

  if (parsedUrl.type === "Episode") {
    return `${parsedUrl.workId}-${parsedUrl.episodeId}__${slug}.json`;
  }
  return `${parsedUrl.workId}__${slug}.json`;
}

async function fetchExpected(
  parsedUrl: AnnictTarget,
  token: string,
): Promise<Expected> {
  const globalId =
    parsedUrl.type === "Episode"
      ? toGlobalId("Episode", parsedUrl.episodeId)
      : toGlobalId("Work", parsedUrl.workId);

  const result = await fetchNode(globalId, token);
  return {
    id: result.work.id,
    title: result.work.title,
    episode: result.episode,
  };
}

async function promptParams(pattern: ParamPattern): Promise<SearchParam> {
  switch (pattern) {
    case "title": {
      const title = await p.text({ message: "title:" });
      if (p.isCancel(title)) process.exit(0);

      return { title };
    }
    case "workTitle-episodeTitle": {
      const workTitle = await p.text({ message: "workTitle:" });
      if (p.isCancel(workTitle)) process.exit(0);

      const episodeTitle = await p.text({ message: "episodeTitle:" });
      if (p.isCancel(episodeTitle)) process.exit(0);

      return { workTitle, episodeTitle };
    }
    case "workTitle-episodeNumber-episodeTitle": {
      const workTitle = await p.text({ message: "workTitle:" });
      if (p.isCancel(workTitle)) process.exit(0);

      const episodeNumber = await p.text({ message: "episodeNumber:" });
      if (p.isCancel(episodeNumber)) process.exit(0);

      const episodeTitle = await p.text({ message: "episodeTitle:" });
      if (p.isCancel(episodeTitle)) process.exit(0);

      return { workTitle, episodeNumber, episodeTitle };
    }
  }
}

/** 対話型フロー */
async function runAddFlow(token: string) {
  p.intro("Add Fixture");

  const pattern = await p.select({
    message: "Select pattern:",
    options: [
      { value: "title", label: "title" },
      { value: "workTitle-episodeTitle", label: "workTitle + episodeTitle" },
      {
        value: "workTitle-episodeNumber-episodeTitle",
        label: "workTitle + episodeNumber + episodeTitle",
      },
    ] as const,
  });
  if (p.isCancel(pattern)) {
    p.cancel("Aborted");
    process.exit(0);
  }

  const params = await promptParams(pattern);

  const annictUrl = await p.text({ message: "Annict URL:" });
  if (p.isCancel(annictUrl)) {
    p.cancel("Aborted");
    process.exit(0);
  }

  await addFixture(params, annictUrl, token);
}

/** フィクスチャ追加処理 */
async function addFixture(
  params: SearchParam,
  annictUrl: string,
  token: string,
) {
  const trimmedParams = trimSearchParam(params);
  const trimmedUrl = annictUrl.trim();
  // URL 検証
  const annictTarget = parseAnnictUrl(trimmedUrl);

  // variants, candidateWorks, expected を取得
  const extracted = extract(trimmedParams);
  const titleVariants = variants(extracted.workTitle);
  const candidateWorks = await searchWorks(titleVariants, token);
  const expected = await fetchExpected(annictTarget, token);

  // 取得結果を表示
  p.log.step(`Variants: ${titleVariants.length} 件`);
  p.log.message(titleVariants.map((v) => `- ${v}`).join("\n"));

  p.log.step(`Candidate Works: ${candidateWorks.length} 件`);
  p.log.message(candidateWorks.map((w) => `- ${w.title}`).join("\n"));

  p.log.step("Expected:");
  if (expected.episode) {
    p.log.message(
      `  ${expected.title}\n  ${expected.episode.numberText} ${expected.episode.title}`,
    );
  } else {
    p.log.message(`  ${expected.title}`);
  }

  // expected.id が candidateWorks に含まれるか検証
  const matchedWork = candidateWorks.find((w) => w.id === expected.id);
  if (!matchedWork) {
    throw new Error("Expected work not found in candidateWorks");
  }

  // expected.episode.id が存在する場合、それも検証
  if (expected.episode) {
    const matchedEpisode = matchedWork.episodes?.find(
      (ep) => ep.id === expected.episode?.id,
    );
    if (!matchedEpisode) {
      throw new Error("Expected episode not found in candidateWorks");
    }
  }

  // Continue? の確認
  const ok = await p.confirm({ message: "Continue?" });
  if (p.isCancel(ok) || !ok) {
    p.cancel("Aborted");
    process.exit(0);
  }

  // ファイル書き出し
  const fixture: Fixture = {
    meta: { createdAt: new Date().toISOString() },
    input: { params: trimmedParams, annictUrl: trimmedUrl },
    expected,
    variants: titleVariants,
    candidateWorks,
  };
  const filename = generateFilename(annictTarget, trimmedParams);
  const filepath = join(fixturesDir, filename);
  writeFileSync(filepath, JSON.stringify(fixture, null, 2), "utf-8");
  p.outro(`Fixture saved: ${filepath}`);
}

/** メイン処理 */
async function main() {
  const token = process.env.ANNICT_TOKEN;
  if (!token) {
    throw new Error("ANNICT_TOKEN environment variable is required");
  }

  await runAddFlow(token);
}

main().catch((error) => {
  p.log.error(error.message || String(error));
  p.cancel("Aborted");
  process.exit(1);
});
