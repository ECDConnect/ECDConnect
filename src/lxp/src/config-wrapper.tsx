import { APIs, Config, DialogServiceProvider, useConfig } from '@ecdlink/core';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import Loader from './components/loader/loader';
import { WalkthroughProvider } from './walkthrougContext';
import { OnlineStatusProvider } from './hooks/useOnlineStatus';
import { persistor, store } from './store';
import { TenantContextProvider, TenantThemeProvider } from './hooks/useTenant';

const ConfigWrapper: React.FC = () => {
  const { loading } = useConfig();
  const [loader, setLoader] = useState(true);

  const isDevelopmentMode =
    !process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development' ||
    window.location.hostname === 'localhost';

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
      <OnlineStatusProvider
        pollUrl={pollUrl}
        interval={20000}
        timeout={10000}
        enablePolling={!isDevelopmentMode}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <TenantContextProvider>
              <TenantThemeProvider defaultThemeUrl={Config.themeUrl}>
                <DialogServiceProvider>
                  <WalkthroughProvider>
                    <App />
                  </WalkthroughProvider>
                </DialogServiceProvider>
              </TenantThemeProvider>
            </TenantContextProvider>
          </PersistGate>
        </Provider>
      </OnlineStatusProvider>
    );
  }
};

export default ConfigWrapper;
