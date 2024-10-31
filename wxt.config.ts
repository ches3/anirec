import type { UserManifest } from "wxt";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	srcDir: "src",
	imports: {
		dirsScanOptions: {
			fileFilter: () => false,
		},
	},
	manifest: ({ browser, manifestVersion }) => {
		const permissions = ["storage", "identity"];
		if (manifestVersion === 2) {
			permissions.push("https://api.annict.com/graphql");
		}

		const browserSpecificSettings: Record<
			string,
			UserManifest["browser_specific_settings"]
		> = {
			firefox: {
				gecko: {
					id: "annict-recorder@ches3.me",
					strict_min_version: "109.0",
				},
			},
		};

		return {
			name: "Annict Recorder",
			version: "0.1.0",
			description: "",
			permissions,
			browser_specific_settings: browserSpecificSettings[browser],
		};
	},
});
