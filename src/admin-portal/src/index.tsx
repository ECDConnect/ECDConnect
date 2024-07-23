import { ConfigProvider } from '@ecdlink/core';
import ReactDOM from 'react-dom';
import ConfigWrapper from './app/config-wrapper';
import './app/i18n';
import './styles.css';
import { TenantContextProvider } from './app/hooks/useTenant';

ReactDOM.render(
  <ConfigProvider>
    <TenantContextProvider>
      <ConfigWrapper />
    </TenantContextProvider>
  </ConfigProvider>,
  document.getElementById('root')
);
