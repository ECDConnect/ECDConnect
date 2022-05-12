import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Config } from '../config';

export interface ConfigContextType {
  children: React.ReactNode | React.ReactNode[] | null;
  loading: boolean;
}

const configContext = createContext<ConfigContextType>({} as ConfigContextType);

function ConfigProvider({ children }: { children: ReactNode }): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);

  const getData = () => {
    setLoading(true);

    const GRAPHQL_API = process.env.REACT_APP_GRAPHQL_API;
    const AUTH_API = process.env.REACT_APP_AUTH_API;
    const THEME_URL = process.env.REACT_APP_THEME_URL;

    console.log({ AUTH_API, GRAPHQL_API, THEME_URL });

    AUTH_API && (Config.authApi = AUTH_API);
    GRAPHQL_API && (Config.graphQlApi = GRAPHQL_API);
    THEME_URL && (Config.themeUrl = THEME_URL);

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const memoedValue = useMemo(
    () => ({
      loading,
    }),
    [loading]
  );

  return (
    <configContext.Provider value={memoedValue as ConfigContextType}>
      {!loading && children}
    </configContext.Provider>
  );
}

export { ConfigProvider, configContext };

export function useConfig(): ConfigContextType {
  return useContext(configContext);
}
