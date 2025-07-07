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
    fetch(`${window.location.origin}/settings.json`)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data) {
          Config.authApi = data.authApi;
          Config.graphQlApi = data.graphQlApi;
          Config.themeUrl = data.themeUrl;
        }

        setLoading(false);
      })
      .catch(function (err) {
        console.log(err, ' error');
        setLoading(false);
      });
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
