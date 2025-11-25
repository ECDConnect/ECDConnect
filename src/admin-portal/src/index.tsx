import { ConfigProvider, SnackbarProvider } from '@ecdlink/core';
import ReactDOM from 'react-dom';
import ConfigWrapper from './app/config-wrapper';
import './app/i18n';
import './styles.css';
import { TenantContextProvider } from './app/hooks/useTenant';

ReactDOM.render(
  <ConfigProvider
    config={{
      authApi: process.env.REACT_APP_API || '',
      graphQlApi: process.env.REACT_APP_GRAPHQLAPI || '',
      themeUrl: process.env.REACT_APP_THEME || '',
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
