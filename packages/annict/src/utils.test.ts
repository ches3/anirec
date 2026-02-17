import { describe, expect, test } from "vitest";
import { getAnnictUrl, toAnnictId } from "./utils";

// atob("V29yay01MzQw") === "Work-5340"
const WORK_ID = "V29yay01MzQw";
// atob("RXBpc29kZS0xNTg0NTI=") === "Episode-158452"
const EPISODE_ID = "RXBpc29kZS0xNTg0NTI=";
// atob("UmVjb3JkLTEyMw==") === "Record-123"
const RECORD_ID = "UmVjb3JkLTEyMw==";
// atob("UmV2aWV3LTQ1Ng==") === "Review-456"
const REVIEW_ID = "UmV2aWV3LTQ1Ng==";

describe("toAnnictId", () => {
	test("作品IDをデコード", () => {
		expect(toAnnictId(WORK_ID)).toEqual({ type: "work", id: "5340" });
	});

	test("エピソードIDをデコード", () => {
		expect(toAnnictId(EPISODE_ID)).toEqual({ type: "episode", id: "158452" });
	});

	test("RecordのIDをデコード", () => {
		expect(toAnnictId(RECORD_ID)).toEqual({ type: "record", id: "123" });
	});

	test("ReviewのIDをデコード", () => {
		expect(toAnnictId(REVIEW_ID)).toEqual({ type: "review", id: "456" });
	});

	test("base64でない文字列", () => {
		expect(toAnnictId("あああ")).toEqual({ type: "invalid" });
	});

	test("空文字列", () => {
		expect(toAnnictId("")).toEqual({ type: "invalid" });
	});
});

describe("getAnnictUrl", () => {
	test("作品IDのみ", () => {
		expect(getAnnictUrl(WORK_ID)).toBe("https://annict.com/works/5340");
	});

	test("作品ID + エピソードID", () => {
		expect(getAnnictUrl(WORK_ID, EPISODE_ID)).toBe(
			"https://annict.com/works/5340/episodes/158452",
		);
	});

	test("不正な作品IDはエラーを投げる", () => {
		expect(() => getAnnictUrl("あああ")).toThrow("Invalid workId: あああ");
	});

	test("不正なIDの組み合わせはエラーを投げる", () => {
		expect(() => getAnnictUrl(WORK_ID, WORK_ID)).toThrow();
	});
});
