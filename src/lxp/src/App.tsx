import {
  DialogServiceProvider,
  SnackbarProvider,
  useDialog,
} from '@ecdlink/core';
import { DialogPosition } from '@ecdlink/ui';
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

if (process.env.NODE_ENV === 'development') {
  stopReportingRuntimeErrors();
}

const App: React.FC = () => {
  const tenant = useTenant();
  const dialog = useDialog();
  const dispatch = useAppDispatch();
  const user = useSelector(authSelectors.getAuthUser);
  const userExpired = useSelector(authSelectors.getUserExpired);
  const userLocalxpiration = JSON.parse(
    localStorage?.getItem('userLocalxpiration')!
  );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

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
                window.location.host.indexOf('localhost') > 0 ? true : false,
            },
            gtagOptions: {
              debug_mode:
                window.location.host.indexOf('localhost') > 0 ? true : false,
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
