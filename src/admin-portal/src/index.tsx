import { ConfigProvider, SnackbarProvider } from '@ecdlink/core';
import ReactDOM from 'react-dom';
import ConfigWrapper from './app/config-wrapper';
import './app/i18n';
import './styles.css';
import { TenantContextProvider } from './app/hooks/useTenant';
import { clearMigratedLocalStorageKeys } from './app/utils/legacy-storage-cleanup.utils';

clearMigratedLocalStorageKeys();

ReactDOM.render(
  <ConfigProvider
    config={{
      authApi: import.meta.env.REACT_APP_API || '',
      graphQlApi: import.meta.env.REACT_APP_GRAPHQLAPI || '',
      themeUrl: import.meta.env.REACT_APP_THEME || '',
      facebookAppId: '',
      googleClientId: '',
      configUrl: import.meta.env.REACT_APP_REMOTE_CONFIG_URL || '',
    }}
  >
    <SnackbarProvider>
      <TenantContextProvider>
        <ConfigWrapper />
      </TenantContextProvider>
    </SnackbarProvider>
  </ConfigProvider>,
  document.getElementById('root')
);
