import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["iife"],
	splitting: false,
	clean: true,
});
