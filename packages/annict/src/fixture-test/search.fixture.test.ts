import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { search } from "../search";
import { searchWorks } from "../util/annict";
import type { Fixture } from "./types";

vi.mock("../util/annict", () => ({
	searchWorks: vi.fn(),
}));

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "fixtures");

const fixtures = readdirSync(fixturesDir)
	.filter((f) => f.endsWith(".json"))
	.map((filename) => {
		const content = readFileSync(join(fixturesDir, filename), "utf-8");
		return { filename, fixture: JSON.parse(content) as Fixture };
	});

describe("fixture tests", () => {
	if (fixtures.length === 0) {
		it.skip("no fixtures yet", () => {});
	} else {
		afterEach(() => {
			vi.restoreAllMocks();
		});

		for (const { filename, fixture } of fixtures) {
			it(filename, async () => {
				// searchWorks をモックして candidateWorks を返す
				vi.mocked(searchWorks).mockResolvedValueOnce(fixture.candidateWorks);

				// search() を実行
				const params = fixture.input.params;
				const result = await search(params, "dummy-token");

				// searchWorks の引数が variants を内包していることを検証
				expect(searchWorks).toHaveBeenCalledWith(
					expect.arrayContaining(fixture.variants),
					"dummy-token",
				);

				// search() の返り値が expected と一致することを検証
				const expected = {
					...fixture.expected,
					episode: fixture.expected.episode ?? undefined,
				};
				expect(result).toEqual(expected);
			});
		}
	}
});
