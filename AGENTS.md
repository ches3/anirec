# AniRec

## プロジェクト概要

- 配信サービスで視聴したアニメをAnnictに自動で記録するツール
- ブラウザの拡張機能とAndroid向けのTaskerスクリプトを提供

## パッケージ構成
  - `@anirec/extension`: ブラウザ拡張機能
  - `@anirec/annict`: Annict APIクライアント・作品検索アルゴリズム
  - `@anirec/server`: Annict OAuthトークン取得/失効用のAPIサーバー
  - `@anirec/tasker`: Tasker用スクリプト

## 開発時の品質チェック

**重要**: コード変更時やコミット前には必ず以下の3つのコマンドを実行してエラーを修正する。  
ユーザーに実行させるのではなく、**コーディングエージェント(Claude CodeやCodex)自身で実行すること**。

```bash
bun run typecheck
bun run check
bun run test
```

## TypeScript規約

- 型アサーション（`as`）は使用せず、型ガードやInferred Type Predicatesを活用する
- `as const`は使用して良い
- 型述語（`is`）は使用しない
- 定数配列から生成できる型は、Union型を直接定義するのではなく`typeof ARRAY[number]`を使用する

## コンポーネント設計

- 1コンポーネント1責務の原則を守る
- 複雑なロジックはカスタムフックまたはユーティリティ関数に分離

## スタイリング

- Tailwind CSS v4を使用
- 基本的なUIはshadcn/uiを使う
- shadcn/uiコンポーネントの追加はコマンドで行う
- 条件付きのクラス名結合には、テンプレートリテラルではなく`cn()`を使う
- グレー系の色は`gray`ではなく`neutral`を使う
- モダンでシンプルなデザインを心がける

## コメント

- 複雑なロジックには説明を記載
- 自明なコードにはコメント不要

## テスト

- テストファイルは対象ファイルと同じディレクトリに配置（`*.test.ts`）
- 失敗系・境界値ケースも含める

## パッケージ管理

- パッケージの追加・削除は必ずコマンドで行う

## 技術スタック

- **言語**: TypeScript
- **モノレポ管理**: Turborepo
- **パッケージマネージャー**: Bun
- **Lint/Format**: Biome
- **テスト**: Vitest

### packages/extension

- **ブラウザ拡張フレームワーク**: WXT
- **UI**: React 19
- **スタイリング**: Tailwind CSS v4
- **バリデーション**: Valibot

### packages/annict

- **API通信**: GraphQL

### packages/server

- **ランタイム**: Cloudflare Workers
- **Webフレームワーク**: Hono
- **バリデーション**: Valibot + `@hono/valibot-validator`

### packages/tasker

- **ビルド**: tsup

## ファイル構成

### ルート

- `biome.json` - 共有Lint/Format設定
- `turbo.json` - モノレポのタスク定義

### packages/annict

- `src/search.ts` - Annict作品・エピソード検索
- `src/record.ts` - Annictへの記録処理
- `src/gql/` - GraphQLクエリ
- `src/fixture-test/` - 実際の検索結果を使ったテスト

### packages/extension

- `src/entrypoints/content/` - 再生ページで動作するコンテンツスクリプト
- `src/entrypoints/options/` - オプションページ
- `src/components/ui/` - shadcn/uiコンポーネント
- `src/utils/` - 共通ユーティリティ関数

### packages/server

- `src/index.ts` - Annict OAuthトークンAPIエンドポイント

### packages/tasker

- `src/index.ts` - Tasker用スクリプトのエントリポイント
