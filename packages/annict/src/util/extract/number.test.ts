import { parseNumber } from "./number";

describe("アラビア数字", () => {
  test("第1話", () => {
    expect(parseNumber("第1話")).toBe(1);
  });
  test("第2話", () => {
    expect(parseNumber("第2話")).toBe(2);
  });
  test("第10話", () => {
    expect(parseNumber("第10話")).toBe(10);
  });
  test("第100話", () => {
    expect(parseNumber("第100話")).toBe(100);
  });
});

describe("全角", () => {
  test("第１話", () => {
    expect(parseNumber("第１話")).toBe(1);
  });
  test("第２話", () => {
    expect(parseNumber("第２話")).toBe(2);
  });
  test("第１０話", () => {
    expect(parseNumber("第１０話")).toBe(10);
  });
  test("第１００話", () => {
    expect(parseNumber("第１００話")).toBe(100);
  });
});

describe("漢数字", () => {
  test("第一話", () => {
    expect(parseNumber("第一話")).toBe(1);
  });
  test("第二話", () => {
    expect(parseNumber("第二話")).toBe(2);
  });
  test("第十話", () => {
    expect(parseNumber("第十話")).toBe(10);
  });
  test("第百話", () => {
    expect(parseNumber("第百話")).toBe(100);
  });
});

describe("大字", () => {
  test("第壱話", () => {
    expect(parseNumber("第壱話")).toBe(1);
  });
  test("第弐話", () => {
    expect(parseNumber("第弐話")).toBe(2);
  });
  test("第拾話", () => {
    expect(parseNumber("第拾話")).toBe(10);
  });
  test("第拾壱話", () => {
    expect(parseNumber("第拾壱話")).toBe(11);
  });
  test("第廿話", () => {
    expect(parseNumber("第廿話")).toBe(20);
  });
  test("第百話", () => {
    expect(parseNumber("第百話")).toBe(100);
  });
});

describe("ローマ数字", () => {
  test("I", () => {
    expect(parseNumber("I")).toBe(1);
  });
  test("II", () => {
    expect(parseNumber("II")).toBe(2);
  });
  test("X", () => {
    expect(parseNumber("X")).toBe(10);
  });
  test("XI", () => {
    expect(parseNumber("XI")).toBe(11);
  });
  test("XX", () => {
    expect(parseNumber("XX")).toBe(20);
  });
  test("C", () => {
    expect(parseNumber("C")).toBe(100);
  });
});

describe("丸数字", () => {
  test("①", () => {
    expect(parseNumber("①")).toBe(1);
  });
  test("⑨", () => {
    expect(parseNumber("⑨")).toBe(9);
  });
  test("⑩", () => {
    expect(parseNumber("⑩")).toBe(10);
  });
  test("⑳", () => {
    expect(parseNumber("⑳")).toBe(20);
  });
  test("㉑", () => {
    expect(parseNumber("㉑")).toBe(21);
  });
  test("㊿", () => {
    expect(parseNumber("㊿")).toBe(50);
  });
  test("①②", () => {
    expect(parseNumber("①②")).toBe(undefined);
  });
});

describe("無効な入力", () => {
  test("", () => {
    expect(parseNumber("")).toBe(undefined);
  });
  test("第話", () => {
    expect(parseNumber("第話")).toBe(undefined);
  });
  test("第懇話", () => {
    expect(parseNumber("第懇話")).toBe(undefined);
  });
  test("IIII", () => {
    expect(parseNumber("IIII")).toBe(undefined);
  });
});
