import { isRecorded, record } from "./record";
import type { Activities } from "./types";
import { createRecord, createReview, viewerActivities } from "./util/annict";

vi.mock("./util/annict", async () => ({
	createRecord: vi.fn(),
	createReview: vi.fn(),
	viewerActivities: vi.fn(),
}));

describe("record", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	test("エピソードを記録", async () => {
		const id = "RXBpc29kZS0xNTg0NTI=";
		await record(id, "token");

		expect(createRecord).toHaveBeenCalledWith(id, "token");
		expect(createReview).not.toHaveBeenCalled();
	});

	test("作品を記録", async () => {
		const id = "V29yay01MzQw";
		await record(id, "token");

		expect(createRecord).not.toHaveBeenCalled();
		expect(createReview).toHaveBeenCalledWith(id, "token");
	});

	test("不正なid", async () => {
		const id = "あああああああああああ";
		await expect(record(id, "token")).rejects.toThrow(`Invalid id: ${id}`);

		expect(createRecord).not.toHaveBeenCalled();
		expect(createReview).not.toHaveBeenCalled();
	});
});

describe("isRecorded", () => {
	const currentDate = new Date();
	const pastDate = new Date();
	pastDate.setDate(currentDate.getDate() - 10);

	const mockValues: Activities[] = [
		{
			items: [
				{
					__typename: "Record",
					createdAt: currentDate.toISOString(),
					work: {
						id: "work_1",
						title: "work_title_1",
					},
					episode: {
						id: "episode_1",
					},
				},
				{
					__typename: "Review",
					createdAt: currentDate.toISOString(),
					work: {
						id: "work_2",
						title: "work_title_2",
					},
				},
			],
			cursor: "cursor_1",
		},
		{
			items: [
				{
					__typename: "Record",
					createdAt: currentDate.toISOString(),
					work: {
						id: "work_3",
						title: "work_title_3",
					},
					episode: {
						id: "episode_3",
					},
				},
			],
			cursor: "cursor_2",
		},
		{
			items: [
				{
					__typename: "Record",
					createdAt: pastDate.toISOString(),
					work: {
						id: "work_4",
						title: "work_title_4",
					},
					episode: {
						id: "episode_4",
					},
				},
				{
					__typename: "Review",
					createdAt: pastDate.toISOString(),
					work: {
						id: "work_5",
						title: "work_title_5",
					},
				},
			],
			cursor: null,
		},
	];

	test("episode id - true", async () => {
		vi.mocked(viewerActivities)
			.mockResolvedValueOnce(mockValues[0])
			.mockResolvedValueOnce({ items: [], cursor: null });

		const result = await isRecorded("episode_1", 1, "token");
		expect(result).toBe(true);
		expect(viewerActivities).toHaveBeenNthCalledWith(
			2,
			30,
			"cursor_1",
			"token",
		);
	});

	test("episode id - false", async () => {
		vi.mocked(viewerActivities)
			.mockResolvedValueOnce(mockValues[0])
			.mockResolvedValueOnce({ items: [], cursor: null });

		const result = await isRecorded("episode_2", 1, "token");
		expect(result).toBe(false);
	});

	test("work id - true", async () => {
		vi.mocked(viewerActivities)
			.mockResolvedValueOnce(mockValues[0])
			.mockResolvedValueOnce({ items: [], cursor: null });

		const result = await isRecorded("work_2", 1, "token");
		expect(result).toBe(true);
	});

	test("work id - false", async () => {
		vi.mocked(viewerActivities)
			.mockResolvedValueOnce(mockValues[0])
			.mockResolvedValueOnce({ items: [], cursor: null });

		const result = await isRecorded("work_1", 1, "token");
		expect(result).toBe(false);
	});

	test("取得したレコードリストが空の場合", async () => {
		vi.mocked(viewerActivities).mockResolvedValueOnce({
			items: [],
			cursor: null,
		});
		const result = await isRecorded("episode_1", 1, "token");
		expect(result).toBe(false);
	});

	test("指定された期間外のレコード", async () => {
		vi.mocked(viewerActivities)
			.mockResolvedValueOnce(mockValues[0])
			.mockResolvedValueOnce(mockValues[1])
			.mockResolvedValueOnce(mockValues[2]);
		const result = await isRecorded("episode_4", 1, "token");
		expect(result).toBe(false);
	});

	test("daysAgoが1未満の場合、エラーを投げる", async () => {
		await expect(isRecorded("", 0, "token")).rejects.toThrow(
			"daysAgo must be greater than 0",
		);
	});
});
