import { ConfigProvider } from '@ecdlink/core';
import ReactDOM from 'react-dom';
import ConfigWrapper from './app/config-wrapper';
import './app/i18n';
import './styles.css';

ReactDOM.render(
  <ConfigProvider>
    <ConfigWrapper />
  </ConfigProvider>,
  document.getElementById('root')
);
