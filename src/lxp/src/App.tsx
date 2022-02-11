import { DialogServiceProvider, useDialog } from '@ecdlink/core';
import { DialogPosition } from '@ecdlink/ui';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import { default as React, useEffect } from 'react';
import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';
import { useSelector } from 'react-redux';
import { AuthRoutes, PublicRoutes } from './app.routes';
import InitialNotificationSetup from './initial-notifications-setup';
import InitialStoreSetup from './initial-store-setup';
import { LoginModal } from './pages/auth/login-modal/login-modal';
import { authSelectors } from './store/auth';
import { settingSelectors } from './store/settings';

const App: React.FC = () => {
  const dialog = useDialog();
  const user = useSelector(authSelectors.getAuthUser);
  const userExpired = useSelector(authSelectors.getUserExpired);
  const applicationSettings = useSelector(settingSelectors.getApplicationSettings);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationSettings]);

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

  const getRoutes = () => {
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
    } else {
      return <PublicRoutes />;
    }
  };

  return (
    <IonApp className="max-w-4xl m-auto bg-uiBg">
      <IonReactRouter>
        <IonRouterOutlet>{getRoutes()}</IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
