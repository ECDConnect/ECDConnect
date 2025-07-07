import { ConfigProvider } from '@ecdlink/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import ReactDOM from 'react-dom';
import ConfigWrapper from './config-wrapper';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './styles.css';
import './i18n';
import Loader from './components/loader/loader';

if (
  process.env.NODE_ENV === 'development' &&
  process.env?.REACT_APP_RUN_MOCKS === 'run_msw'
) {
  const { worker } = require('./mocks/browser');
  worker.start();
}

const updateHandler = (registration: ServiceWorkerRegistration) => {
  if (window.confirm('An update is available. Would you like to reload?')) {
    window.location.reload();
  }
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
const registering = serviceWorkerRegistration.register({
  onUpdate: updateHandler,
});

console.log('[REACT] render app');
ReactDOM.render(
  <ConfigProvider>
    <ConfigWrapper />
  </ConfigProvider>,
  document.getElementById('root')
);

defineCustomElements(window);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
