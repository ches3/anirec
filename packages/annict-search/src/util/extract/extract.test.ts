import { extract, extractEpisode, extractFullTitle } from "./extract";

describe("extract", () => {
	test("workTitle & episodeTitle", () => {
		const result = extract({
			workTitle: "響け！ユーフォニアム",
			episodeTitle: "第一回 ようこそハイスクール",
		});
		expect(result).toEqual({
			workTitle: "響け！ユーフォニアム",
			episode: {
				number: 1,
				numberText: "第一回",
				title: "ようこそハイスクール",
			},
		});
	});

	test("title", () => {
		const result = extract({
			title: "響け！ユーフォニアム 第一回 ようこそハイスクール",
		});
		expect(result).toEqual({
			workTitle: "響け！ユーフォニアム",
			episode: {
				number: 1,
				numberText: "第一回",
				title: "ようこそハイスクール",
			},
		});
	});
});

describe("extractEpisode", () => {
	test("第一回 ようこそハイスクール", () => {
		const result = extractEpisode("第一回 ようこそハイスクール");
		expect(result).toEqual({
			number: 1,
			numberText: "第一回",
			title: "ようこそハイスクール",
		});
	});

	test("第一回　ようこそハイスクール", () => {
		const result = extractEpisode("第一回 ようこそハイスクール");
		expect(result).toEqual({
			number: 1,
			numberText: "第一回",
			title: "ようこそハイスクール",
		});
	});

	test("ようこそハイスクール", () => {
		const result = extractEpisode("ようこそハイスクール");
		expect(result).toEqual({
			number: undefined,
			numberText: undefined,
			title: "ようこそハイスクール",
		});
	});

	test("第一回「ようこそハイスクール」", () => {
		const result = extractEpisode("第一回「ようこそハイスクール」");
		expect(result).toEqual({
			number: 1,
			numberText: "第一回",
			title: "ようこそハイスクール",
		});
	});

	test("番外編 かけだすモナカ", () => {
		const result = extractEpisode("番外編 かけだすモナカ");
		expect(result).toEqual({
			number: undefined,
			numberText: "番外編",
			title: "かけだすモナカ",
		});
	});

	test("第壹話 ひたぎクラブ 其ノ壹", () => {
		const result = extractEpisode("第壹話 ひたぎクラブ 其ノ壹");
		expect(result).toEqual({
			number: 1,
			numberText: "第壹話",
			title: "ひたぎクラブ 其ノ壹",
		});
	});

	test("Episode I 邂逅の…邪王真眼", () => {
		const result = extractEpisode("Episode I 邂逅の…邪王真眼");
		expect(result).toEqual({
			number: 1,
			numberText: "Episode I",
			title: "邂逅の…邪王真眼",
		});
	});
});

describe("extractFullTitle", () => {
	test("響け！ユーフォニアム 第一回 ようこそハイスクール", () => {
		const result = extractFullTitle(
			"響け！ユーフォニアム 第一回 ようこそハイスクール",
		);
		expect(result).toEqual({
			title: "響け！ユーフォニアム",
			episode: {
				number: 1,
				numberText: "第一回",
				title: "ようこそハイスクール",
			},
		});
	});

	test("響け！ユーフォニアム 第一回", () => {
		const result = extractFullTitle("響け！ユーフォニアム 第一回");
		expect(result).toEqual({
			title: "響け！ユーフォニアム",
			episode: {
				number: 1,
				numberText: "第一回",
				title: undefined,
			},
		});
	});

	test("響け！ユーフォニアム 第一回「ようこそハイスクール」", () => {
		const result = extractFullTitle(
			"響け！ユーフォニアム 第一回「ようこそハイスクール」",
		);
		expect(result).toEqual({
			title: "響け！ユーフォニアム",
			episode: {
				number: 1,
				numberText: "第一回",
				title: "ようこそハイスクール",
			},
		});
	});

	test("響け！ユーフォニアム", () => {
		const result = extractFullTitle("響け！ユーフォニアム");
		expect(result).toEqual({
			title: "響け！ユーフォニアム",
			episode: undefined,
		});
	});

	test("響け！ユーフォニアム 番外編 かけだすモナカ", () => {
		const result = extractFullTitle(
			"響け！ユーフォニアム 番外編 かけだすモナカ",
		);
		expect(result).toEqual({
			title: "響け！ユーフォニアム",
			episode: {
				number: undefined,
				numberText: "番外編",
				title: "かけだすモナカ",
			},
		});
	});

	test("化物語 第壹話 ひたぎクラブ 其ノ壹", () => {
		const result = extractFullTitle("化物語 第壹話 ひたぎクラブ 其ノ壹");
		expect(result).toEqual({
			title: "化物語",
			episode: {
				number: 1,
				numberText: "第壹話",
				title: "ひたぎクラブ 其ノ壹",
			},
		});
	});

	test("中二病でも恋がしたい！ Episode I 邂逅の…邪王真眼", () => {
		const result = extractFullTitle(
			"中二病でも恋がしたい！ Episode I 邂逅の…邪王真眼",
		);
		expect(result).toEqual({
			title: "中二病でも恋がしたい！",
			episode: {
				number: 1,
				numberText: "Episode I",
				title: "邂逅の…邪王真眼",
			},
		});
	});

	test("リズと青い鳥 本編", () => {
		const result = extractFullTitle("リズと青い鳥 本編");
		expect(result).toEqual({
			title: "リズと青い鳥",
			episode: undefined,
		});
	});
});
