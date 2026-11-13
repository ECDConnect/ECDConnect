/// <reference types="vite/client" />

// Consumed by the Vite apps in src/, which expose REACT_APP_* variables.
interface ImportMetaEnv {
  readonly REACT_APP_MAP_API_KEY?: string;
}
