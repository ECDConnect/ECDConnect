import { useLayoutEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, useConfig } from '@ecdlink/core';
import { Config, DialogServiceProvider } from '@ecdlink/core';
import Loader from '@/components/loader/loader';
import { persistor, store } from '@/store';
import App from '@/App';

function ConfigWrapper() {
  const { loading } = useConfig();
  const [loader, setLoader] = useState(true);
  useLayoutEffect(() => {
    // minimum loading effect
    const loadingTimer = setTimeout(() => {
      if (!loading) setLoader(false);
    }, 2500);
    return () => clearTimeout(loadingTimer);
  }, [loading]);

  if (loader && !loading) return <Loader />;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider themeEndPoint={Config.themeUrl} overRideCache={true}>
          <DialogServiceProvider>
            <App />
          </DialogServiceProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
export default ConfigWrapper;
