import { ConfigProvider, SnackbarProvider } from '@ecdlink/core';
import ReactDOM from 'react-dom';
import ConfigWrapper from './app/config-wrapper';
import './app/i18n';
import './styles.css';
import { TenantContextProvider } from './app/hooks/useTenant';

ReactDOM.render(
  <ConfigProvider>
    <SnackbarProvider>
      <TenantContextProvider>
        <ConfigWrapper />
      </TenantContextProvider>
    </SnackbarProvider>
  </ConfigProvider>,
  document.getElementById('root')
);
