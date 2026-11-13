/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  /** Set from package.json by vite.config.ts. */
  readonly REACT_APP_VERSION: string;
  readonly REACT_APP_API?: string;
  readonly REACT_APP_GRAPHQLAPI?: string;
  readonly REACT_APP_THEME?: string;
  readonly REACT_APP_REMOTE_CONFIG_URL?: string;
  readonly REACT_APP_RUNENVIRONMENT?: string;
  readonly REACT_APP_MAP_API_KEY?: string;
  readonly REACT_APP_GOOGLE_CLIENT_ID?: string;
  readonly REACT_APP_FACEBOOK_APP_ID?: string;
  readonly REACT_APP_EXPOSE_AUTH_CODES?: string;
  readonly REACT_APP_GADEBUGMODE?: string;
  readonly REACT_APP_RUN_MOCKS?: string;
  readonly REACT_APP_DISABLE_GRAPHQL_ERROR_ALERT?: string;
  readonly REACT_APP_DISABLE_GRAPHQL_LOGGING?: string;
  readonly REACT_APP_SUPPRESS_ERROR_LOGGING?: string;
}
