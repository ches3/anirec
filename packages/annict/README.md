# @anirec/annict-search

  [Annict](https://annict.com/)のAPIを使って作品の検索と記録をするライブラリ

## 使い方

### search()

  - エピソードの検索
  - 以下の形式で検索可能
    - `{ workTitle: "作品タイトル", episodeNumber: "話数", episodeTitle: "エピソードタイトル" }`
    - `{ workTitle: "作品タイトル", episodeTitle: "話数 エピソードタイトル" }`
    - `{ title: "作品タイトル 話数 エピソードタイトル" }`

  ```typescript
  // { workTitle: "作品タイトル", episodeNumber: "話数", episodeTitle: "エピソードタイトル" } の形式で検索
  const result = await search(
    {
      workTitle: "響け！ユーフォニアム",
      episodeNumber: "第一回",
      episodeTitle: "ようこそハイスクール",
    },
    token,
  );


  // { title: "作品タイトル", episodeTitle: "話数 エピソードタイトル" } の形式で検索
  const result = await search(
    {
      workTitle: "響け！ユーフォニアム",
      episodeTitle: "第一回 ようこそハイスクール",
    },
    token,
  );

  // { title: "作品タイトル 話数 エピソードタイトル" } の形式で検索
  const result = await search(
    { title: "響け！ユーフォニアム 第一回 ようこそハイスクール" },
    token,
  );
  ```

### record()
  
  - エピソードの記録
  - search()で取得したエピソードのidを指定する
    - エピソードがある場合は `result.episode.id`
    - 劇場版などのエピソードがない作品は `result.id`

  ```typescript
  const id = result.episode?.id || result.id;
  await record(id, token);
  ```

### isRecorded()

  - 指定した日数以内にエピソードが記録済みかどうかを確認
  - 重複記録を防ぐために使用

  ```typescript
  // 7日以内に記録されていない場合は記録する
  if (await isRecorded(id, 7, token)) {
    console.log("already recorded");
  } else {
    await record(id, token);
    console.log("recorded");
  }
  ```
