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

  const normalizedTitle = normalize(title, {
    remove: { anime: true, movie: true },
  });
  const matchList = [
    /(?:\p{L}{4,}|(?:\p{sc=Han}|[\p{sc=Hira}ーｰ]|[\p{sc=Kana}ーｰ]){4,}|(?=\p{sc=Han})(?:\p{sc=Han}|[\p{sc=Hira}ーｰ]|[\p{sc=Kana}ーｰ]){2,})/gu,
    /(?:[\p{sc=Hira}ーｰ]){2,}/gu,
    /(?:[\p{sc=Kana}ーｰ]){2,}/gu,
    /\p{sc=Han}{2,}/gu,
    /(?:\p{sc=Han}|[\p{sc=Hira}ーｰ]|[\p{sc=Kana}ーｰ]){2,}/gu,
    /\p{Script=Latin}{2,}/gu,
    /(?:\p{sc=Han}|[\p{sc=Hira}ーｰ]|[\p{sc=Kana}ーｰ]|\p{Script=Latin}){2,}/gu,
    /\p{L}{2,}/gu,
  ].flatMap((pattern) => normalizedTitle.match(pattern) ?? []);
  const ignoreList = [
    "season",
    "シーズン",
    "シリーズ",
    "part",
    "前編",
    "後編",
    "物語",
  ];
  words.push(
    ...matchList.filter((word) => !ignoreList.includes(word.toLowerCase())),
  );

  return [...new Set(words)];
}
