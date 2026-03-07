import { buildFullTitle } from "./title";

describe("buildFullTitle", () => {
  test("episode がない場合は workTitle のみを返す", () => {
    const result = buildFullTitle({
      workTitle: "響け！ユーフォニアム",
      episode: undefined,
    });

    expect(result).toBe("響け！ユーフォニアム");
  });

  test("workTitle, numberText, title を結合して返す", () => {
    const result = buildFullTitle({
      workTitle: "もめんたりー・リリィ",
      episode: {
        number: 14,
        numberText: "第14話",
        title: "続いていく割烹、割烹！",
      },
    });

    expect(result).toBe("もめんたりー・リリィ 第14話 続いていく割烹、割烹！");
  });

  test("numberText と title の前後空白は trim される", () => {
    const result = buildFullTitle({
      workTitle: "ヲタクに恋は難しい",
      episode: {
        number: undefined,
        numberText: "  OAD  ",
        title: "  社員旅行と願いごと  ",
      },
    });

    expect(result).toBe("ヲタクに恋は難しい OAD 社員旅行と願いごと");
  });

  test("numberText と title が空文字の場合は workTitle のみを返す", () => {
    const result = buildFullTitle({
      workTitle: "響け！ユーフォニアム",
      episode: {
        number: undefined,
        numberText: "   ",
        title: "",
      },
    });

    expect(result).toBe("響け！ユーフォニアム");
  });
});
