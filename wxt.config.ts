import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	srcDir: "src",
	manifest: {
		name: "Annict Recorder",
		version: "0.1.0",
		description: "",
		permissions: ["storage"],
	},
});
