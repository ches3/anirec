import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["iife"],
  splitting: false,
  noExternal: ["@anirec/annict"],
  globalName: "AniRec",
  clean: true,
  minify: true,
});
