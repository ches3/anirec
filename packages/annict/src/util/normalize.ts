import { toHan, toZen } from "@ches3/zenhan";
import { kanji2number } from "@geolonia/japanese-numeral";
import { deromanize } from "romans";
import { numMatch } from "./match";

type Options = {
  /**
   * Unicode正規化形式を指定
   * - NFC: 正準等価性に基づく合成 (濁点結合文字などを合成)
   * - NFKC: 互換性に基づく合成 (①→1, Ⅲ→III なども正規化)
   */
  unicode?: "NFC" | "NFD" | "NFKC" | "NFKD";
  lowerCase?: boolean;
  zenhan?: {
    alphabet?: boolean;
    number?: boolean;
    space?: boolean;
    symbol?: boolean;
    kana?: boolean;
  };
  number?: {
    kansuji?: boolean;
    daiji?: boolean;
    roman?: boolean;
  };
  symbol?: boolean;
  remove?: {
    space?: boolean;
    anime?: boolean;
    movie?: boolean;
    bracket?: boolean;
    symbol?: boolean;
    nonNumAndLetter?: boolean;
  };
};

export function normalize(title: string, options?: Options): string {
  let normalizedTitle = title;

  if (options?.unicode) {
    normalizedTitle = normalizedTitle.normalize(options.unicode);
  }

  if (options?.lowerCase === true) {
    normalizedTitle = normalizedTitle.toLowerCase();
  }

  if (options?.zenhan?.alphabet === true) {
    normalizedTitle = toHan(normalizedTitle, { alphabet: true });
  }

  if (options?.zenhan?.number === true) {
    normalizedTitle = toHan(normalizedTitle, { number: true });
  }

  if (options?.zenhan?.space === true) {
    normalizedTitle = toHan(normalizedTitle, { space: true });
  }

  if (options?.zenhan?.symbol === true) {
    normalizedTitle = toHan(normalizedTitle, { symbol: true });
  }

  if (options?.zenhan?.kana === true) {
    normalizedTitle = toZen(normalizedTitle, { kana: true });
  }

  if (options?.number?.kansuji === true) {
    normalizedTitle = normalizedTitle.replace(numMatch.kanji, (match) => {
      try {
        return String(kanji2number(match));
      } catch {
        return match;
      }
    });
  }

  if (options?.number?.roman === true) {
    normalizedTitle = normalizedTitle.replace(numMatch.roman, (match) => {
      try {
        return String(deromanize(match));
      } catch {
        return match;
      }
    });
  }

  if (options?.symbol === true) {
    normalizedTitle = normalizedTitle.replace(/･/g, "・");
    normalizedTitle = normalizedTitle.replace(/､/g, "、");
    normalizedTitle = normalizedTitle.replace(/｡/g, "。");
    normalizedTitle = normalizedTitle.replace(/〜/g, "~");
    normalizedTitle = normalizedTitle.replace(/−/g, "-");
    normalizedTitle = normalizedTitle.replace(/‐/g, "-");
    normalizedTitle = normalizedTitle.replace(/‑/g, "-");
    normalizedTitle = normalizedTitle.replace(/–/g, "-");
    normalizedTitle = normalizedTitle.replace(/—/g, "-");
    normalizedTitle = normalizedTitle.replace(/―/g, "-");
    normalizedTitle = normalizedTitle.replace(/−/g, "-");
    normalizedTitle = normalizedTitle.replace(/－/g, "-");
    normalizedTitle = normalizedTitle.replace(/﹣/g, "-");
    normalizedTitle = normalizedTitle.replace(/─/g, "-");
    normalizedTitle = normalizedTitle.replace(/━/g, "-");
  }

  if (options?.remove?.space === true) {
    normalizedTitle = normalizedTitle.replace(/\s+/g, "");
  }

  if (options?.remove?.anime === true) {
    normalizedTitle = normalizedTitle.replace(
      /^(アニメ)|(テレビアニメ)|(TVアニメ)/i,
      "",
    );
  }

  if (options?.remove?.movie === true) {
    normalizedTitle = normalizedTitle.replace(/^(映画)|(劇場版)/, "");
  }

  if (options?.remove?.bracket === true) {
    normalizedTitle = normalizedTitle.replace(/「(.+?)」/g, "$1");
    normalizedTitle = normalizedTitle.replace(/『(.+?)』/g, "$1");
    normalizedTitle = normalizedTitle.replace(/【(.+?)】/g, "$1");
    normalizedTitle = normalizedTitle.replace(/\((.+?)\)/g, "$1");
    normalizedTitle = normalizedTitle.replace(/（(.+?)）/g, "$1");
    normalizedTitle = normalizedTitle.replace(/<(.+?)>/g, "$1");
    normalizedTitle = normalizedTitle.replace(/《(.+?)》/g, "$1");
    normalizedTitle = normalizedTitle.replace(/〈(.+?)〉/g, "$1");
  }

  if (options?.remove?.symbol === true) {
    normalizedTitle = normalizedTitle.replace(/[!-/:-@[-`{-~]/g, "");
  }

  if (options?.remove?.nonNumAndLetter === true) {
    normalizedTitle = normalizedTitle.replace(/[^\p{N}\p{L}]/gu, "");
  }
  return normalizedTitle;
}

export function isSameTitle(a: string, b: string, weak = false): boolean {
  const options: Options = {
    unicode: "NFKC",
    lowerCase: true,
    number: {
      kansuji: true,
      daiji: true,
      roman: true,
    },
    symbol: true,
    remove: {
      space: true,
      anime: true,
      bracket: true,
      nonNumAndLetter: weak,
    },
  };
  return normalize(a, options) === normalize(b, options);
}
