import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import type { SearchParam } from "../types";
import { fetchNode, searchWorks } from "../util/annict";
import { extract } from "../util/extract/extract";
import { applyMapping } from "../util/search/mapping";
import { variants } from "../util/search/variants";
import type { AnnictTarget, Expected, Fixture, ParamPattern } from "./types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");
const RATE_LIMIT_MS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function validateExpected(
  expected: Expected,
  candidateWorks: Awaited<ReturnType<typeof searchWorks>>,
): void {
  const matchedWork = candidateWorks.find((w) => w.id === expected.id);
  if (!matchedWork) {
    throw new Error("Expected work not found in candidateWorks");
  }

  if (expected.episode) {
    const matchedEpisode = matchedWork.episodes?.find(
      (ep) => ep.id === expected.episode?.id,
    );
    if (!matchedEpisode) {
      throw new Error("Expected episode not found in candidateWorks");
    }
  }
}

async function buildFixtureData(
  params: SearchParam,
  annictUrl: string,
  token: string,
  options?: { rateLimit?: boolean },
): Promise<Pick<Fixture, "expected" | "variants" | "candidateWorks">> {
  const trimmedParams = trimSearchParam(params);
  const trimmedUrl = annictUrl.trim();
  const annictTarget = parseAnnictUrl(trimmedUrl);

  const target = applyMapping(extract(trimmedParams));
  const titleVariants = variants(target.workTitle);
  const candidateWorks = await searchWorks(titleVariants, token);
  if (options?.rateLimit) {
    await sleep(RATE_LIMIT_MS);
  }

  const expected = await fetchExpected(annictTarget, token);
  if (options?.rateLimit) {
    await sleep(RATE_LIMIT_MS);
  }

  validateExpected(expected, candidateWorks);

  return {
    expected,
    variants: titleVariants,
    candidateWorks,
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
  const annictTarget = parseAnnictUrl(trimmedUrl);
  const {
    expected,
    variants: titleVariants,
    candidateWorks,
  } = await buildFixtureData(trimmedParams, trimmedUrl, token);

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

  const ok = await p.confirm({ message: "Continue?" });
  if (p.isCancel(ok) || !ok) {
    p.cancel("Aborted");
    process.exit(0);
  }

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

/** フィクスチャ一括再生成 */
async function runRegenerateFlow(token: string) {
  p.intro("Regenerate Fixtures");

  const filenames = readdirSync(fixturesDir)
    .filter((f) => f.endsWith(".json"))
    .sort();
  const total = filenames.length;
  const failures: { filename: string; error: string }[] = [];

  for (const [index, filename] of filenames.entries()) {
    const filepath = join(fixturesDir, filename);
    const progress = `[${index + 1}/${total}] ${filename}`;

    try {
      const content = readFileSync(filepath, "utf-8");
      const fixture = JSON.parse(content) as Fixture;
      const data = await buildFixtureData(
        fixture.input.params,
        fixture.input.annictUrl,
        token,
        { rateLimit: true },
      );

      const updated: Fixture = {
        ...fixture,
        expected: data.expected,
        variants: data.variants,
        candidateWorks: data.candidateWorks,
      };
      writeFileSync(filepath, JSON.stringify(updated, null, 2), "utf-8");
      p.log.success(`${progress} ... ok`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ filename, error: message });
      p.log.error(`${progress} ... failed: ${message}`);
    }
  }

  if (failures.length > 0) {
    p.log.error(`${failures.length} fixture(s) failed to regenerate`);
    for (const { filename, error } of failures) {
      p.log.message(`  - ${filename}: ${error}`);
    }
    p.cancel("Aborted");
    process.exit(1);
  }

  p.outro(`Regenerated ${total} fixture(s)`);
}

/** メイン処理 */
async function main() {
  const token = process.env.ANNICT_TOKEN;
  if (!token) {
    throw new Error("ANNICT_TOKEN environment variable is required");
  }

  const command = process.argv[2];
  if (command === "regenerate") {
    await runRegenerateFlow(token);
  } else {
    await runAddFlow(token);
  }
}

main().catch((error) => {
  p.log.error(error.message || String(error));
  p.cancel("Aborted");
  process.exit(1);
});
