import { applyMapping } from "./mapping";

test("workTitle の直接一致では episode を保持する", () => {
  const result = applyMapping({
    workTitle: "ヲタクに恋は難しい OAD「社員旅行と願いごと」",
    episode: {
      number: undefined,
      numberText: undefined,
      title: "",
    },
  });

  expect(result).toEqual({
    workTitle: "ヲタクに恋は難しい OAD3「社員旅行と願い事」",
    episode: {
      number: undefined,
      numberText: undefined,
      title: "",
    },
  });
});

test("再結合タイトル一致では episode を破棄する", () => {
  const result = applyMapping({
    workTitle: "ヲタクに恋は難しい",
    episode: {
      number: 500,
      numberText: "OAD",
      title: "社員旅行と願いごと",
    },
  });

  expect(result).toEqual({
    workTitle: "ヲタクに恋は難しい OAD3「社員旅行と願い事」",
    episode: undefined,
  });
});
