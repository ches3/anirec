import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    useTabs: false,
    tabWidth: 2,
    endOfLine: "lf",
    sortImports: true,
    ignorePatterns: [
      "packages/annict/src/fixture-test/fixtures/*.json",
      "packages/annict/src/gql/generated.ts",
    ],
  },
});
