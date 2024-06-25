import {
  APIs,
  Config,
  DialogServiceProvider,
  ThemeProvider,
  useConfig,
} from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import Loader from './components/loader/loader';
import { WalkthroughProvider } from './walkthrougContext';
import { OnlineStatusProvider } from './hooks/useOnlineStatus';
import { persistor, store } from './store';
import { TenantContextProvider } from './hooks/useTenant';

const ConfigWrapper: React.FC = () => {
  const { loading } = useConfig();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    // minimum loading effect
    if (!loading) {
      setTimeout(() => {
        setLoader(false);
      }, 2500);
    }
  }, [loading]);

  if (loader) {
    return <Loader />;
  } else {
    const pollUrl = new URL(APIs.onlineCheck, Config.authApi).href;
    return (
      <OnlineStatusProvider pollUrl={pollUrl} interval={3000} timeout={2000}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <TenantContextProvider>
              <ThemeProvider
                themeEndPoint={Config.themeUrl}
                overRideCache={false}
              >
                <DialogServiceProvider>
                  <WalkthroughProvider>
                    <App />
                  </WalkthroughProvider>
                </DialogServiceProvider>
              </ThemeProvider>
            </TenantContextProvider>
          </PersistGate>
        </Provider>
      </OnlineStatusProvider>
    );
  }
};

export default ConfigWrapper;
