import ReactGA from 'react-ga';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import TagManager from 'react-gtm-module';

import { IonReactRouter } from '@ionic/react-router';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';

import {
  DialogServiceProvider,
  SnackbarProvider,
  useDialog,
} from '@ecdlink/core';
import { DialogPosition } from '@ecdlink/ui';

import { AuthRoutes, PublicRoutes } from '@/routes';
import InitialStoreSetup from '@/initial-store-setup';
import InitialNotificationSetup from '@/initial-notifications-setup';
import useClearSiteData from '@ecdlink/core/lib/hooks/useClearSiteData';

import { authSelectors } from '@/store/auth';
import { settingSelectors } from '@/store/settings';

import { LoginModal } from '@/pages/auth/login-modal/login-modal';

import '@/styles.css';

function App() {
  const dialog = useDialog();
  const user = useSelector(authSelectors.getAuthUser);
  const userExpired = useSelector(authSelectors.getUserExpired);
  const applicationSettings = useSelector(
    settingSelectors.getApplicationSettings
  );

  const clearSiteData = useClearSiteData();

  function getRoutes() {
    // show auth routes for auth users
    if (user && user.isTempUser !== true) {
      return (
        <InitialStoreSetup>
          <SnackbarProvider>
            <DialogServiceProvider>
              <InitialNotificationSetup>
                <AuthRoutes />
              </InitialNotificationSetup>
            </DialogServiceProvider>
          </SnackbarProvider>
        </InitialStoreSetup>
      );
    }
    // show public routes for non auth users
    return <PublicRoutes />;
  }

  useEffect(() => {
    if (applicationSettings && applicationSettings.Google) {
      if (applicationSettings.Google.GoogleAnalyticsTag) {
        ReactGA.initialize(applicationSettings.Google.GoogleAnalyticsTag);
        ReactGA.pageview(window.location.pathname + window.location.search);
      }

      if (applicationSettings.Google.GoogleTagManager) {
        const tagManagerArgs = {
          gtmId: applicationSettings.Google.GoogleTagManager,
        };

        TagManager.initialize(tagManagerArgs);
      }
    }
  }, [applicationSettings]);

  useEffect(() => {
    if (userExpired) {
      dialog({
        blocking: true,
        position: DialogPosition.Middle,
        render(onSubmit) {
          return <LoginModal loginSuccessful={onSubmit} />;
        },
      });
    }
  });

  useEffect(() => {
    if (!user) {
      clearSiteData();
    }
  }, [clearSiteData, user]);

  return (
    <IonApp className="m-auto max-w-4xl bg-white">
      <IonReactRouter>
        <IonRouterOutlet>{getRoutes()}</IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
