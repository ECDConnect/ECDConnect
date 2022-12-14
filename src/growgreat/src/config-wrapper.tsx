import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import {
  ThemeProvider,
  useConfig,
  Config,
  DialogServiceProvider,
} from '@ecdlink/core';
import App from '@/App';
import { persistor, store } from '@/store';
import Loader from '@/components/loader/loader';

function ConfigWrapper() {
  const { loading } = useConfig();

  if (loading) {
    return <Loader />;
  }

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
