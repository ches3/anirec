import { variants } from "./variants";

test("響け！ユーフォニアム", () => {
  const words = variants("響け！ユーフォニアム");
  expect(words).toEqual(
    expect.arrayContaining([
      "響け！ユーフォニアム",
      "響け!ユーフォニアム",
      "響け",
      "ユーフォニアム",
    ]),
  );
});

test("中二病でも恋がしたい！", () => {
  const words = variants("中二病でも恋がしたい！");
  expect(words).toEqual(
    expect.arrayContaining([
      "中二病でも恋がしたい",
      "でも",
      "がしたい",
      "中二病",
    ]),
  );
});

test("CLANNAD番外編", () => {
  const words = variants("CLANNAD番外編");
  expect(words).toEqual(expect.arrayContaining(["CLANNAD", "番外編"]));
});

test("ignoreList に含まれる語は除外する", () => {
  const words = variants("よふかしのうたSeason2");
  expect(words).not.toContain("Season");
  expect(words).not.toContain("Season2");
});

test("長音符を含むカタカナを正しく抽出する", () => {
  const words = variants("ユーフォニアム");
  expect(words).toContain("ユーフォニアム");
  expect(words).not.toContain("フォニアム");
});
