import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const config: CodegenConfig = {
	schema: {
		"https://api.annict.com/graphql": {
			headers: {
				Authorization: `Bearer ${process.env.ANNICT_TOKEN}`,
			},
		},
	},
	documents: "src/gql/query.gql",
	generates: {
		"src/gql/generated.ts": {
			plugins: ["typescript", "typescript-operations", "typed-document-node"],
			config: {
				useTypeImports: true,
			},
		},
	},
};

export default config;
