import { Config, NotificationsProvider, useConfig } from '@ecdlink/core';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import App from './app';
import { ContentLoader } from './components/content-loader/content-loader';
import Notifications from './components/notifications/notifications';
import { AuthProvider } from './hooks/useAuth';
import { TenantThemeProvider, useTenant } from './hooks/useTenant';
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
      <>
        <Helmet>
          <title>{getTitle()}</title>
        </Helmet>
        <TenantThemeProvider defaultThemeUrl={Config.themeUrl}>
          <AuthProvider>
            <Router history={history}>
              <NotificationsProvider>
                <App />
                <Notifications />
              </NotificationsProvider>
            </Router>
          </AuthProvider>
        </TenantThemeProvider>
      </>
    );
  } else {
    return (
      <>
        <Helmet>
          <title>{getTitle()}</title>
        </Helmet>
        <ContentLoader />
      </>
    );
  }
};

export default ConfigWrapper;
