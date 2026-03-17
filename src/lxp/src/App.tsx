import {
  AppErrorHandler,
  Config,
  DialogServiceProvider,
  SnackbarProvider,
  useDialog,
  useTheme,
} from '@ecdlink/core';
import { ActionModal, DialogPosition, renderIcon } from '@ecdlink/ui';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import { default as React, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import TagManager from 'react-gtm-module';
import { useSelector } from 'react-redux';
import { AuthRoutes, PublicRoutes } from '@routes';
import InitialNotificationSetup from './initial-notifications-setup';
import InitialStoreSetup from './initial-store-setup';
import { LoginModal } from './pages/auth/login-modal/login-modal';
import { authSelectors } from './store/auth';
import { differenceInHours, isSameDay } from 'date-fns';
import { stopReportingRuntimeErrors } from 'react-error-overlay';
import { useTenant } from './hooks/useTenant';
import { Helmet } from 'react-helmet';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FacebookProvider } from 'react-facebook';

if (process.env.NODE_ENV === 'development') {
  stopReportingRuntimeErrors();
}

const App: React.FC = () => {
  const tenant = useTenant();
  const { theme } = useTheme();
  const dialog = useDialog();
  const user = useSelector(authSelectors.getAuthUser);
  const userExpired = useSelector(authSelectors.getUserExpired);
  const [freeMemory, setFreeMemory] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);

  const isSslEnabled = window.location.protocol === 'https:';

  const getTitle = () => {
    const env = process.env.REACT_APP_RUNENVIRONMENT || '';
    let title = env;
    if (title !== '') title += ' ';
    title +=
      (tenant.isWhiteLabel
        ? `${tenant.tenant?.applicationName} - ECD Connect`
        : tenant.tenant?.applicationName) || 'ECD Connect';
    return title;
  };

  useEffect(() => {
    if (navigator?.storage?.estimate) {
      navigator.storage
        .estimate()
        .then((estimate) => {
          if (estimate?.quota) {
            const freeMemoryMB = estimate.quota / (1024 * 1024);
            setFreeMemory(Math.round(freeMemoryMB));
          }
        })
        .catch(() => {
          setFreeMemory(0);
        });
    } else {
      setFreeMemory(0);
    }
  }, []);

  useEffect(() => {
    if (tenant?.tenant) {
      if (tenant.tenant.googleAnalyticsTag) {
        ReactGA.initialize([
          {
            trackingId: tenant.tenant.googleAnalyticsTag,
            gaOptions: {
              debug_mode:
                window.location.host.indexOf('localhost') > 0 ||
                !!process.env.REACT_APP_GADEBUGMODE,
            },
            gtagOptions: {
              debug_mode:
                window.location.host.indexOf('localhost') > 0 ||
                !!process.env.REACT_APP_GADEBUGMODE,
            },
          },
          // {
          //   trackingId: "your second GA measurement id",
          // },
        ]);

        ReactGA.send({
          hitType: 'pageview',
          page: window.location.pathname + window.location.search,
        });
      }

      if (tenant.tenant.googleTagManager) {
        const tagManagerArgs = {
          gtmId: tenant.tenant.googleTagManager,
        };

        TagManager.initialize(tagManagerArgs);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  useEffect(() => {
    if (theme?.images) {
      try {
        let favicons = document.querySelectorAll('link[rel~="icon"]');
        favicons.forEach(function (favicon) {
          favicon?.parentNode?.removeChild(favicon);
        });
        let favicon_link_html = document.createElement('link');
        favicon_link_html.rel = 'icon';
        favicon_link_html.href = theme.images.faviconUrl;
        favicon_link_html.type = 'image/x-icon';

        const head = document.getElementsByTagName('head')[0];
        head.insertBefore(favicon_link_html, head.firstChild);

        // Preload favicon to trigger service worker
        const preloadFavicon = new Image();
        preloadFavicon.src = theme.images.faviconUrl;
      } catch (e) {}
    }
  }, [theme, theme?.images]);

  useEffect(() => {
    if (userExpired) {
      dialog({
        position: DialogPosition.Middle,
        blocking: true,
        render: (onSubmit, onClose) => {
          return <LoginModal loginSuccessful={onSubmit} />;
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userExpired]);

  useEffect(() => {
    if (freeMemory !== 0 && freeMemory <= 200) {
      setErrorMessage(true);
      // Optionally block form or show message immediately
    }
  }, [freeMemory]);

  const onFocus = () => {
    const focusItem = JSON.parse(localStorage?.getItem('appFocus')!);
    const isSameDayItem = isSameDay(new Date(), new Date(focusItem));
    const differenceInHoursBetweenItems = differenceInHours(
      new Date(),
      new Date(focusItem)
    );

    if (!isSameDayItem || differenceInHoursBetweenItems > 6) {
      localStorage.setItem('appFocus', JSON.stringify(new Date()));
    }
  };

  useEffect(() => {
    window.addEventListener('focus', onFocus);
    onFocus();
    return () => {
      window.removeEventListener('focus', onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadView = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (errorMessage) {
      dialog({
        position: DialogPosition.Middle,
        blocking: false,
        fullOverlay: true,
        render: (onSubmit, onClose) => {
          return (
            <ActionModal
              customIcon={renderIcon(
                'ExclamationIcon',
                `z-20 w-28 h-28 text-alertMain`
              )}
              className={'bg-white'}
              title={'Your phone storage is almost full!'}
              detailText={
                'You have less than 10MB available. Please clear some items to keep using ECD Connect'
              }
              actionButtons={[
                {
                  text: 'Close',
                  textColour: 'white',
                  colour: 'quatenary',
                  type: 'filled',
                  leadingIcon: 'CheckCircleIcon',
                  onClick: () => {
                    onSubmit();
                  },
                },
              ]}
            />
          );
        },
      });
    }
  }, [dialog, errorMessage]);

  useEffect(() => {
    let hasShownModal = false;

    const handleOutdatedBrowser = (e: CustomEvent) => {
      if (hasShownModal) return;
      hasShownModal = true;

      dialog({
        position: DialogPosition.Middle,
        blocking: true,
        color: 'bg-white',
        fullOverlay: true,
        render: (onClose) => (
          <ActionModal
            customIcon={renderIcon(
              'ExclamationIcon',
              `z-20 w-28 h-28 text-alertMain`
            )}
            title={`Your internet browser is out of date!`}
            detailText={`Please go to your app store and update your browser before continuing. Tap refresh to try again.`}
            actionButtons={[
              {
                text: 'Refresh',
                colour: 'quatenary',
                type: 'filled',
                onClick: reloadView,
                textColour: 'white',
                leadingIcon: 'RefreshIcon',
              },
            ]}
          />
        ),
      });
    };

    window.addEventListener(
      'browser-outdated',
      handleOutdatedBrowser as EventListener
    );

    // Fallback: re-trigger detection if the script loaded late
    const timeout = setTimeout(() => {
      if (
        !hasShownModal &&
        (window as any).$buo &&
        typeof (window as any).$buo.show === 'function'
      ) {
        (window as any).$buo.show();
      }
    }, 4000); // 4 seconds is safe

    return () => {
      window.removeEventListener(
        'browser-outdated',
        handleOutdatedBrowser as EventListener
      );
      clearTimeout(timeout);
    };
  }, [dialog]);

  const routerContent = (
    <IonReactRouter>
      <AppErrorHandler>
        <IonRouterOutlet>
          {user && user.isTempUser !== true ? (
            <InitialStoreSetup>
              <SnackbarProvider>
                <DialogServiceProvider>
                  <InitialNotificationSetup>
                    <AuthRoutes />
                  </InitialNotificationSetup>
                </DialogServiceProvider>
              </SnackbarProvider>
            </InitialStoreSetup>
          ) : (
            <PublicRoutes />
          )}
        </IonRouterOutlet>
      </AppErrorHandler>
    </IonReactRouter>
  );

  const appShell = (
    <IonApp className="m-auto max-w-4xl bg-white">
      <Helmet>
        <title>{getTitle()}</title>
      </Helmet>
      {routerContent}
    </IonApp>
  );

  const googleLogin = Config.googleClientId ? (
    <GoogleOAuthProvider clientId={Config.googleClientId}>
      {appShell}
    </GoogleOAuthProvider>
  ) : (
    appShell
  );

  const facebookLogin =
    Config.facebookAppId && isSslEnabled ? (
      <FacebookProvider appId={Config.facebookAppId}>
        {googleLogin}
      </FacebookProvider>
    ) : (
      googleLogin
    );

  const root = facebookLogin;

  return root;
};

export default App;
