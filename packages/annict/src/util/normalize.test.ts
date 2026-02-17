import { isSameTitle, normalize } from "./normalize";

describe("normalize", () => {
  test("響け！ユーフォニアム２", () => {
    expect(
      normalize("響け！ユーフォニアム２", { zenhan: { number: true } }),
    ).toBe("響け！ユーフォニアム2");
  });

  test("劇場版『響け！ユーフォニアム～誓いのフィナーレ～』", () => {
    expect(
      normalize("劇場版『響け！ユーフォニアム～誓いのフィナーレ～』", {
        remove: { anime: true, movie: true, bracket: true },
      }),
    ).toBe("響け！ユーフォニアム～誓いのフィナーレ～");
  });

  test("Unicode NFC正規化（濁点の結合文字）", () => {
    // NFD: 結合文字で表現された濁点（が = か + ゙）
    const nfd =
      "\u53cb\u9054\u306e\u59b9\u304b\u3099\u4ffa\u306b\u305f\u3099\u3051\u30a6\u30b5\u3099\u3044";
    // NFC: 合成済み文字（が = が）
    const nfc =
      "\u53cb\u9054\u306e\u59b9\u304c\u4ffa\u306b\u3060\u3051\u30a6\u30b6\u3044";

    expect(normalize(nfd, { unicode: "NFC" })).toBe(nfc);
  });

  test("Unicode NFKC正規化（互換分解）", () => {
    // 丸囲み数字、ローマ数字、年号、半角カナ
    const raw = "①Ⅲ㍻ﾊﾟ";
    const nfkc = "1III平成パ";
    expect(normalize(raw, { unicode: "NFKC" })).toBe(nfkc);
  });

  test("Unicode NFC正規化はオプションなしでは適用されない", () => {
    // NFD: 結合文字で表現された濁点
    const nfd =
      "\u53cb\u9054\u306e\u59b9\u304b\u3099\u4ffa\u306b\u305f\u3099\u3051\u30a6\u30b5\u3099\u3044";

    // オプションなしではNFDのまま
    expect(normalize(nfd)).toBe(nfd);
  });
});

describe("isSameTitle", () => {
  test("Unicode正規化（NFKC）でタイトルが一致する", () => {
    // NFD: 結合文字で表現された濁点
    const nfd =
      "\u53cb\u9054\u306e\u59b9\u304b\u3099\u4ffa\u306b\u305f\u3099\u3051\u30a6\u30b5\u3099\u3044";
    // NFC: 合成済み文字
    const nfc =
      "\u53cb\u9054\u306e\u59b9\u304c\u4ffa\u306b\u3060\u3051\u30a6\u30b6\u3044";

    expect(isSameTitle(nfd, nfc)).toBe(true);
  });
});
