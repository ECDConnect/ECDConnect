import {
  Config,
  NotificationsProvider,
  ThemeProvider,
  useConfig,
} from '@ecdlink/core';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import App from './app';
import { ContentLoader } from './components/content-loader/content-loader';
import Notifications from './components/notifications/notifications';
import { AuthProvider } from './hooks/useAuth';
import { TenantContextProvider } from './hooks/useTenant';

const history = createBrowserHistory();

const ConfigWrapper: React.FC = () => {
  const { loading } = useConfig();

  if (!loading) {
    return (
      <TenantContextProvider>
        <ThemeProvider themeEndPoint={Config.themeUrl} overRideCache={true}>
          <AuthProvider>
            <Router history={history}>
              <NotificationsProvider>
                <App />
                <Notifications />
              </NotificationsProvider>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </TenantContextProvider>
    );
  } else {
    return (
      <TenantContextProvider>
        <ContentLoader />
      </TenantContextProvider>
    );
  }
};

export default ConfigWrapper;
