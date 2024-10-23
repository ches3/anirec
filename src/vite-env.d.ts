/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly WXT_ANNICT_TOKEN: string | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
