import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { DialogPosition } from '@ecdlink/ui';
import { DialogServiceProvider, useDialog } from '@ecdlink/core';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';
import { useSelector } from 'react-redux';
import { AuthRoutes, PublicRoutes } from '@/routes';
import { authSelectors } from '@/store/auth';
import { settingSelectors } from '@/store/settings';
import InitialStoreSetup from '@/initial-store-setup';
import InitialNotificationSetup from '@/initial-notifications-setup';
import { LoginModal } from '@/pages/auth/login-modal/login-modal';

const App: React.FC = () => {
  const dialog = useDialog();
  const user = useSelector(authSelectors.getAuthUser);
  const userExpired = useSelector(authSelectors.getUserExpired);
  const applicationSettings = useSelector(
    settingSelectors.getApplicationSettings
  );

  function getRoutes() {
    // show auth routes for auth users
    if (user && user.isTempUser !== true) {
      return (
        <InitialStoreSetup>
          <DialogServiceProvider>
            <InitialNotificationSetup>
              <AuthRoutes />
            </InitialNotificationSetup>
          </DialogServiceProvider>
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
        position: DialogPosition.Middle,
        blocking: true,
        render(onSubmit) {
          return <LoginModal loginSuccessful={onSubmit} />;
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userExpired]);

  return (
    <IonApp className="m-auto h-screen w-full bg-white">
      <IonReactRouter>
        <IonRouterOutlet>{getRoutes()}</IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
