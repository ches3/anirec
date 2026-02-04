import { normalize } from "../normalize";

export function variants(title: string): string[] {
	const words = [
		title,
		normalize(title, { unicode: "NFC" }),
		normalize(title, { unicode: "NFKC" }),
		normalize(title, { zenhan: { alphabet: true } }),
		normalize(title, { zenhan: { number: true } }),
		normalize(title, { zenhan: { symbol: true } }),
		normalize(title, { zenhan: { alphabet: true, number: true } }),
		normalize(title, { zenhan: { alphabet: true, symbol: true } }),
		normalize(title, { zenhan: { number: true, symbol: true } }),
		normalize(title, {
			zenhan: { alphabet: true, number: true, symbol: true },
		}),
		normalize(title, {
			remove: { anime: true, movie: true, bracket: true },
		}),
	];

	const matchList = normalize(title, {
		remove: { anime: true, movie: true },
	}).match(
		/(?:\p{L}{4,}|(?:\p{sc=Han}|\p{sc=Hira}|\p{sc=Kana}){4,}|(?=\p{sc=Han})(?:\p{sc=Han}|\p{sc=Hira}|\p{sc=Kana}){2,})/gu,
	);
	const ignoreList = [
		"season",
		"シーズン",
		"シリーズ",
		"part",
		"前編",
		"後編",
		"物語",
	];
	if (matchList) {
		words.push(...matchList.filter((word) => !ignoreList.includes(word)));
	}

	return [...new Set(words)];
}
