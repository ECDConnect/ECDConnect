import { ConfigProvider } from '@ecdlink/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import ReactDOM from 'react-dom';
import ConfigWrapper from './config-wrapper';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './styles.css';
import './i18n';
import pwa from './utils/pwa';
import { clearMigratedLocalStorageKeys } from './utils/common/legacy-storage-cleanup.utils';

if (import.meta.env.DEV && import.meta.env.REACT_APP_RUN_MOCKS === 'run_msw') {
  import('./mocks/browser').then(({ worker }) => worker.start());
}

clearMigratedLocalStorageKeys();

const updateHandler = (registration: ServiceWorkerRegistration) => {
  window.dispatchEvent(
    new CustomEvent('sw-update', { detail: { registration } })
  );
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: updateHandler,
});

pwa.addInstallEventListeners();

console.log('[REACT] render app');
ReactDOM.render(
  <ConfigProvider
    config={{
      authApi: import.meta.env.REACT_APP_API || '',
      graphQlApi: import.meta.env.REACT_APP_GRAPHQLAPI || '',
      themeUrl: import.meta.env.REACT_APP_THEME || '',
      facebookAppId: import.meta.env.REACT_APP_FACEBOOK_APP_ID || '',
      googleClientId: import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || '',
      configUrl: import.meta.env.REACT_APP_REMOTE_CONFIG_URL || '',
      exposeAuthCodesForTesting:
        import.meta.env.REACT_APP_EXPOSE_AUTH_CODES === 'true',
    }}
  >
    <ConfigWrapper />
  </ConfigProvider>,
  document.getElementById('root')
);

defineCustomElements(window);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
