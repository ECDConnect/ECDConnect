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
import { TenantContextProvider, useTenant } from './hooks/useTenant';
import { Helmet } from 'react-helmet';

const history = createBrowserHistory();

const ConfigWrapper: React.FC = () => {
  const { loading } = useConfig();
  const tenant = useTenant();

  const getTitle = () => {
    const env = process.env.REACT_APP_RUNENVIRONMENT || '';
    var title = env;
    if (title !== '') title += ' ';
    title +=
      (tenant.isWhiteLabel
        ? `${tenant.tenant?.applicationName} - Admin Portal`
        : tenant.tenant?.applicationName) || 'Admin Portal';
    return title;
  };

  if (!loading) {
    return (
      <TenantContextProvider>
        <Helmet>
          <title>{getTitle()}</title>
        </Helmet>
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
        <Helmet>
          <title>{getTitle()}</title>
        </Helmet>
        <ContentLoader />
      </TenantContextProvider>
    );
  }
};

export default ConfigWrapper;
