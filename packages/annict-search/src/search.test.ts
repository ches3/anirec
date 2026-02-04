import { search } from "./search";
import type { Work } from "./types";
import { searchWorks } from "./util/annict";

vi.mock("./util/annict", () => ({
	searchWorks: vi.fn(),
}));

const mockValue: Work[] = [
	{
		id: "V29yay00MzA4",
		title: "響け！ユーフォニアム",
		noEpisodes: false,
		episodes: [
			{
				id: "RXBpc29kZS0xODM1Mg==",
				title: "ようこそハイスクール",
				number: 1,
				numberText: "第一回",
			},
			{
				id: "RXBpc29kZS0xODQ1Mw==",
				title: "よろしくユーフォニアム",
				number: 2,
				numberText: "第二回",
			},
			{
				id: "RXBpc29kZS0xODU3OQ==",
				title: "はじめてアンサンブル",
				number: 3,
				numberText: "第三回",
			},
			{
				id: "RXBpc29kZS0xODY4Mg==",
				title: "うたうよソルフェージュ",
				number: 4,
				numberText: "第四回",
			},
			{
				id: "RXBpc29kZS0xOTE2Ng==",
				title: "ただいまフェスティバル",
				number: 5,
				numberText: "第五回",
			},
			{
				id: "RXBpc29kZS0xOTM1MQ==",
				title: "きらきらチューバ",
				number: 6,
				numberText: "第六回",
			},
			{
				id: "RXBpc29kZS0xOTQ0MQ==",
				title: "なきむしサクソフォン",
				number: 7,
				numberText: "第七回",
			},
			{
				id: "RXBpc29kZS0xOTU1Mw==",
				title: "おまつりトライアングル",
				number: 8,
				numberText: "第八回",
			},
			{
				id: "RXBpc29kZS0xOTc1Nw==",
				title: "おねがいオーディション",
				number: 9,
				numberText: "第九回",
			},
			{
				id: "RXBpc29kZS0xOTg5Ng==",
				title: "まっすぐトランペット",
				number: 10,
				numberText: "第十回",
			},
			{
				id: "RXBpc29kZS0yMDAxNw==",
				title: "おかえりオーディション",
				number: 11,
				numberText: "第十一回",
			},
			{
				id: "RXBpc29kZS0yMDMxOQ==",
				title: "わたしのユーフォニアム",
				number: 12,
				numberText: "第十二回",
			},
			{
				id: "RXBpc29kZS0yMDM5MA==",
				title: "さよならコンクール",
				number: 13,
				numberText: "第十三回",
			},
			{
				id: "RXBpc29kZS0zMjMwNA==",
				title: "かけだすモナカ",
				number: undefined,
				numberText: "番外編",
			},
		],
		seriesList: ["響け！ユーフォニアム"],
	},
	{
		id: "V29yay00ODI2",
		title: "響け！ユーフォニアム2",
		noEpisodes: false,
		episodes: [
			{
				id: "RXBpc29kZS03NzU4Nw==",
				title: "まなつのファンファーレ",
				number: 1,
				numberText: "第一回",
			},
			{
				id: "RXBpc29kZS03NzgxNw==",
				title: "とまどいフルート",
				number: 2,
				numberText: "第二回",
			},
			{
				id: "RXBpc29kZS03ODUzMA==",
				title: "なやめるノクターン",
				number: 3,
				numberText: "第三回",
			},
			{
				id: "RXBpc29kZS04MDEwMg==",
				title: "めざめるオーボエ",
				number: 4,
				numberText: "第四回",
			},
			{
				id: "RXBpc29kZS04MDI2Mg==",
				title: "きせきのハーモニー",
				number: 5,
				numberText: "第五回",
			},
			{
				id: "RXBpc29kZS04MDQzNw==",
				title: "あめふりコンダクター",
				number: 6,
				numberText: "第六回",
			},
			{
				id: "RXBpc29kZS04MDU1NA==",
				title: "えきびるコンサート",
				number: 7,
				numberText: "第七回",
			},
			{
				id: "RXBpc29kZS04MDczMw==",
				title: "かぜひきラプソディー",
				number: 8,
				numberText: "第八回",
			},
			{
				id: "RXBpc29kZS04MzMwNQ==",
				title: "ひびけ！ユーフォニアム",
				number: 9,
				numberText: "第九回",
			},
			{
				id: "RXBpc29kZS04ODQ1Nw==",
				title: "ほうかごオブリガート",
				number: 10,
				numberText: "第十回",
			},
			{
				id: "RXBpc29kZS04ODY3MQ==",
				title: "はつこいトランペット",
				number: 11,
				numberText: "第十一回",
			},
			{
				id: "RXBpc29kZS04ODc5Ng==",
				title: "さいごのコンクール",
				number: 12,
				numberText: "第十二回",
			},
			{
				id: "RXBpc29kZS04ODg4Nw==",
				title: "はるさきエピローグ",
				number: 13,
				numberText: "最終回",
			},
		],
		seriesList: ["響け！ユーフォニアム"],
	},
	{
		id: "V29yay01MzQw",
		title: "劇場版 響け！ユーフォニアム～誓いのフィナーレ～",
		noEpisodes: true,
		episodes: [],
		seriesList: ["響け！ユーフォニアム"],
	},
];

afterEach(() => {
	vi.restoreAllMocks();
});

describe("workTitle & episodeNumber & episodeTitle", () => {
	test("返り値を確認", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響け！ユーフォニアム",
				episodeNumber: "第一回",
				episodeTitle: "ようこそハイスクール",
			},
			"token",
		);
		expect(result).toEqual({
			id: "V29yay00MzA4",
			title: "響け！ユーフォニアム",
			episode: {
				id: "RXBpc29kZS0xODM1Mg==",
				number: 1,
				numberText: "第一回",
				title: "ようこそハイスクール",
			},
		});
	});

	test("エピソードタイトルを省略", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響け！ユーフォニアム",
				episodeNumber: "第一回",
				episodeTitle: "",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
	});

	test("話数を省略", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響け！ユーフォニアム",
				episodeNumber: "",
				episodeTitle: "ようこそハイスクール",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
	});

	test("タイトルが一致しない場合", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響けユーフォニアム",
				episodeNumber: "第一回",
				episodeTitle: "ようこそハイスクール",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
	});

	test("タイトルが一致しない場合 (エピソードタイトルを省略)", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響けユーフォニアム",
				episodeNumber: "第一回",
				episodeTitle: "",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual(undefined);
	});

	test("エピソードがない作品", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "劇場版 響け！ユーフォニアム～誓いのフィナーレ～",
				episodeNumber: "",
				episodeTitle: "",
			},
			"token",
		);
		expect(result).toEqual({
			id: "V29yay01MzQw",
			title: "劇場版 響け！ユーフォニアム～誓いのフィナーレ～",
			episode: undefined,
		});
	});

	test("'シリーズ名 シーズンタイトル'の形式", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響け！ユーフォニアム 響け！ユーフォニアム2",
				episodeNumber: "第一回",
				episodeTitle: "",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS03NzU4Nw==");
	});

	test("存在しないタイトル", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce([]);
		const result = await search(
			{
				workTitle: "",
				episodeNumber: "",
				episodeTitle: "",
			},
			"",
		);
		expect(result).toBe(undefined);
	});
});

describe("workTitle & episodeTitle", () => {
	test("返り値を確認", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響け！ユーフォニアム",
				episodeTitle: "第一回 ようこそハイスクール",
			},
			"token",
		);
		expect(result).toEqual({
			id: "V29yay00MzA4",
			title: "響け！ユーフォニアム",
			episode: {
				id: "RXBpc29kZS0xODM1Mg==",
				number: 1,
				numberText: "第一回",
				title: "ようこそハイスクール",
			},
		});
	});

	test("エピソードタイトルを省略", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響け！ユーフォニアム",
				episodeTitle: "第一回",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
	});

	test("話数を省略", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響け！ユーフォニアム",
				episodeTitle: "ようこそハイスクール",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
	});

	test("タイトルが一致しない場合", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響けユーフォニアム",
				episodeTitle: "第一回 ようこそハイスクール",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
	});

	test("タイトルが一致しない場合 (エピソードタイトルを省略)", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響けユーフォニアム",
				episodeTitle: "第一回",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual(undefined);
	});

	test("エピソードがない作品", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "劇場版 響け！ユーフォニアム～誓いのフィナーレ～",
				episodeTitle: "",
			},
			"token",
		);
		expect(result).toEqual({
			id: "V29yay01MzQw",
			title: "劇場版 響け！ユーフォニアム～誓いのフィナーレ～",
			episode: undefined,
		});
	});

	test("存在しないタイトル", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce([]);
		const result = await search({ workTitle: "", episodeTitle: "" }, "");
		expect(result).toBe(undefined);
	});

	test("'シリーズ名 シーズンタイトル'の形式", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				workTitle: "響け！ユーフォニアム 響け！ユーフォニアム2",
				episodeTitle: "第一回",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS03NzU4Nw==");
	});
});

describe("title", () => {
	test("返り値を確認", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				title: "響け！ユーフォニアム 第一回 ようこそハイスクール",
			},
			"token",
		);
		expect(result).toEqual({
			id: "V29yay00MzA4",
			title: "響け！ユーフォニアム",
			episode: {
				id: "RXBpc29kZS0xODM1Mg==",
				number: 1,
				numberText: "第一回",
				title: "ようこそハイスクール",
			},
		});
	});

	test("エピソードタイトルを省略", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				title: "響け！ユーフォニアム 第一回",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
	});

	test("作品タイトルが一致しない場合", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				title: "響けユーフォニアム 第一回 ようこそハイスクール",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS0xODM1Mg==");
	});

	test("作品タイトルが一致しない場合 (エピソードタイトルを省略)", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				title: "響けユーフォニアム 第一回",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual(undefined);
	});

	test("エピソードがない作品", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				title: "劇場版 響け！ユーフォニアム～誓いのフィナーレ～",
			},
			"token",
		);
		expect(result).toEqual({
			id: "V29yay01MzQw",
			title: "劇場版 響け！ユーフォニアム～誓いのフィナーレ～",
			episode: undefined,
		});
	});

	test("'シリーズ名 シーズンタイトル'の形式", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mockValue);
		const result = await search(
			{
				title: "響け！ユーフォニアム 響け！ユーフォニアム2 第一回",
			},
			"token",
		);
		expect(result?.episode?.id).toEqual("RXBpc29kZS03NzU4Nw==");
	});

	test("存在しないタイトル", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce([]);
		const result = await search({ title: "" }, "");
		expect(result).toBe(undefined);
	});
});

describe("Annict上のタイトルが`workTitle episodeTitle`となっている作品", () => {
	const mock: Work[] = [
		{
			id: "V29yay0xNTA3NA==",
			title: "もめんたりー・リリィ 第14話「続いていく割烹、割烹！」",
			noEpisodes: true,
			episodes: [],
			seriesList: ["もめんたりー・リリィ"],
		},
	];

	test("workTitle & episodeNumber & episodeTitle", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mock);
		const result = await search(
			{
				workTitle: "もめんたりー・リリィ",
				episodeNumber: "第14話",
				episodeTitle: "続いていく割烹、割烹！",
			},
			"token",
		);
		expect(result).toEqual({
			id: "V29yay0xNTA3NA==",
			title: "もめんたりー・リリィ 第14話「続いていく割烹、割烹！」",
			episode: undefined,
		});
	});

	test("workTitle & episodeTitle", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mock);
		const result = await search(
			{
				workTitle: "もめんたりー・リリィ",
				episodeTitle: "第14話「続いていく割烹、割烹！」",
			},
			"token",
		);
		expect(result).toEqual({
			id: "V29yay0xNTA3NA==",
			title: "もめんたりー・リリィ 第14話「続いていく割烹、割烹！」",
			episode: undefined,
		});
	});

	test("title", async () => {
		vi.mocked(searchWorks).mockResolvedValueOnce(mock);
		const result = await search(
			{
				title: "もめんたりー・リリィ 第14話「続いていく割烹、割烹！」",
			},
			"token",
		);
		expect(result).toEqual({
			id: "V29yay0xNTA3NA==",
			title: "もめんたりー・リリィ 第14話「続いていく割烹、割烹！」",
			episode: undefined,
		});
	});
});
