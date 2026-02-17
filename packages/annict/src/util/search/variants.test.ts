import { variants } from "./variants";

test("響け！ユーフォニアム", () => {
  const words = variants("響け！ユーフォニアム");
  expect(words).toEqual([
    "響け！ユーフォニアム",
    "響け!ユーフォニアム",
    "響け",
    "ユーフォニアム",
  ]);
});
