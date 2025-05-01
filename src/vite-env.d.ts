/// <reference types="vite/client" />
// vite-env.d.ts or env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_VERSION: string;
  // add more as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
