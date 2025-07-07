import {
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
import { settingActions } from './store/settings';
// import BackgroundSync from './components/background-sync/background-sync';
import { differenceInHours, getTime, isSameDay } from 'date-fns';
import { syncThunkActions } from './store/sync';
import { useAppDispatch } from './store';
import { practitionerSelectors } from './store/practitioner';
import { AppErrorHandler } from '@ecdlink/core';
import { stopReportingRuntimeErrors } from 'react-error-overlay';
import { useTenant } from './hooks/useTenant';
import { Helmet } from 'react-helmet';
import { userActions, userSelectors } from './store/user';
import { useOnlineStatus } from './hooks/useOnlineStatus';

if (process.env.NODE_ENV === 'development') {
  stopReportingRuntimeErrors();
}

const App: React.FC = () => {
  const tenant = useTenant();
  const { theme } = useTheme();
  const dialog = useDialog();
  const dispatch = useAppDispatch();
  const user = useSelector(authSelectors.getAuthUser);
  const userExpired = useSelector(authSelectors.getUserExpired);
  const userLocalxpiration = JSON.parse(
    localStorage?.getItem('userLocalxpiration')!
  );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { isOnline } = useOnlineStatus();
  const userUnstableConnection = useSelector(
    userSelectors.getUserUnstableConnection
  );

  const [expirationTime, setExpirationTime] = useState<number>();

  const getTitle = () => {
    const env = process.env.REACT_APP_RUNENVIRONMENT || '';
    var title = env;
    if (title !== '') title += ' ';
    title +=
      (tenant.isWhiteLabel
        ? `${tenant.tenant?.applicationName} - ECD Connect`
        : tenant.tenant?.applicationName) || 'ECD Connect';
    return title;
  };

  useEffect(() => {
    const intervalId = setInterval(updateTime, 3600000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const updateTime = () => {
    setExpirationTime(getTime(new Date()));
  };

  useEffect(() => {
    if (!!tenant && !!tenant.tenant) {
      if (!!tenant.tenant.googleAnalyticsTag) {
        ReactGA.initialize([
          {
            trackingId: tenant.tenant.googleAnalyticsTag,
            gaOptions: {
              debug_mode:
                (window.location.host.indexOf('localhost') > 0
                  ? true
                  : false) || !!process.env.REACT_APP_GADEBUGMODE,
            },
            gtagOptions: {
              debug_mode:
                (window.location.host.indexOf('localhost') > 0
                  ? true
                  : false) || !!process.env.REACT_APP_GADEBUGMODE,
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

      if (!!tenant.tenant.googleTagManager) {
        const tagManagerArgs = {
          gtmId: tenant.tenant.googleTagManager,
        };

        TagManager.initialize(tagManagerArgs);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  useEffect(() => {
    if (theme && theme.images) {
      try {
        let favicons = document.querySelectorAll('link[rel~="icon"]');
        favicons.forEach(function (favicon) {
          favicon?.parentNode?.removeChild(favicon);
        });
        var favicon_link_html = document.createElement('link');
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
  }, [theme?.images]);

  useEffect(() => {
    if (userExpired) {
      dialog({
        position: DialogPosition.Middle,
        blocking: true,
        render: (onSubmit, onClose) => {
          return (
            <LoginModal loginSuccessful={onSubmit} updateTime={updateTime} />
          );
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userExpired]);

  const onFocus = () => {
    const focusItem = JSON.parse(localStorage?.getItem('appFocus')!);
    const isSameDayItem = isSameDay(new Date(), new Date(focusItem));
    const differenceInHoursBetweenItems = differenceInHours(
      new Date(),
      new Date(focusItem)
    );

    if (!isSameDayItem || differenceInHoursBetweenItems > 6) {
      handleSync();
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

  useEffect(() => {
    if (userUnstableConnection) {
      dialog({
        position: DialogPosition.Middle,
        blocking: false,
        render: (onSubmit, onClose) => {
          return (
            <ActionModal
              customIcon={renderIcon(
                'ExclamationIcon',
                `z-20 w-28 h-28 text-alertMain`
              )}
              title={'Weak connection'}
              detailText={
                'Your internet connection is unstable. Turn off mobile data and Wi-Fi to keep using the app, or connect to a stronger network.'
              }
              actionButtons={[
                {
                  text: 'Okay',
                  textColour: 'white',
                  colour: 'primary',
                  type: 'filled',
                  leadingIcon: 'CheckCircleIcon',
                  onClick: () => {
                    dispatch(userActions.updateConnectionStatus(false));
                    onSubmit();
                  },
                },
              ]}
            />
          );
        },
      });
    }
  }, [userUnstableConnection]);

  const handleSync = async () => {
    if (practitioner?.isPrincipal === true) {
      await dispatch(syncThunkActions.syncOfflineData({}));
      dispatch(settingActions.setLastDataSync());
    } else {
      dispatch(syncThunkActions.syncOfflineDataForPractitioner({}));
    }
    dispatch(settingActions.setLastDataSync());
    // asyncCheck();
  };

  // const asyncCheck = async () => {
  //   if (user?.auth_token) {
  //     const asyncCheckresponse = await new SettingsService(
  //       user?.auth_token!
  //     ).queryChangesToSync(lastDataSyncDate);

  //     if (asyncCheckresponse === false) {
  //       window.location.reload();
  //     }
  //   }
  // };

  const getRoutes = () => {
    if (user && user.isTempUser !== true) {
      return (
        <InitialStoreSetup>
          <SnackbarProvider>
            <DialogServiceProvider>
              <InitialNotificationSetup>
                <AuthRoutes />
                {/* <BackgroundSync /> */}
              </InitialNotificationSetup>
            </DialogServiceProvider>
          </SnackbarProvider>
        </InitialStoreSetup>
      );
    } else {
      return <PublicRoutes />;
    }
  };

  return (
    <IonApp className="m-auto max-w-4xl bg-white">
      <Helmet>
        <title>{getTitle()}</title>
      </Helmet>
      <IonReactRouter>
        <AppErrorHandler>
          <IonRouterOutlet>{getRoutes()}</IonRouterOutlet>
        </AppErrorHandler>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
