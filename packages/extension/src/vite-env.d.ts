/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WXT_ANNICT_TOKEN: string | undefined;
  readonly WXT_CLIENT_ID: string | undefined;
  readonly WXT_SERVER_URL: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
