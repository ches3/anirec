import { isRecorded, record, search } from "./index";

const token = "YOUR_ANNICT_TOKEN";

let result:
  | {
      id: string;
      title: string;
      episode:
        | {
            id: string;
            title: string | undefined;
            number: number | undefined;
            numberText: string | undefined;
          }
        | undefined;
    }
  | undefined;

// { title: "作品タイトル", episodeTitle: "話数 エピソードタイトル" }の形式で検索
result = await search(
  {
    workTitle: "響け！ユーフォニアム",
    episodeTitle: "第一回 ようこそハイスクール",
  },
  token,
);

// { title: "作品タイトル 話数 エピソードタイトル" }の形式で検索
result = await search(
  { title: "響け！ユーフォニアム 第一回 ようこそハイスクール" },
  token,
);

if (result) {
  const id = result.episode?.id || result.id;

  // 記録済みか確認
  if (await isRecorded(id, 7, token)) {
    console.log("already recorded");
  } else {
    await record(id, token);
    console.log("recorded");
  }
} else {
  console.log("not found");
}
