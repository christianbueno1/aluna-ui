/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Agrega aquí más variables de entorno según se necesiten
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
