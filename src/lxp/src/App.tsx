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
import { default as React, useEffect, useMemo, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import ReactGA from 'react-ga4';
import TagManager from 'react-gtm-module';
import { useDispatch, useSelector } from 'react-redux';
import { AuthRoutes, PublicRoutes } from '@routes';
import InitialNotificationSetup from './initial-notifications-setup';
import InitialStoreSetup from './initial-store-setup';
import { LoginModal } from './pages/auth/login-modal/login-modal';
import { PinSetup } from './components/pin-lock/pin-setup';
import { PinUnlock } from './components/pin-lock/pin-unlock';
import { authActions, authSelectors } from './store/auth';
import { useInactivityLock } from './hooks/useInactivityLock';
import { useVersionCheck } from './hooks/useVersionCheck';
import { UpdateRequired } from './pages/update-required/update-required';
import { useTenant } from './hooks/useTenant';
import { Helmet } from 'react-helmet';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FacebookProvider } from 'react-facebook';
import { settingActions, settingSelectors } from './store/settings';
import { captureAcquisitionTracking } from '@/utils/user/acquisition-tracking.utils';
import { clearPin, hasPin, touchActivity } from '@/utils/security/pin-lock';

captureAcquisitionTracking();

const App: React.FC = () => {
  const tenant = useTenant();
  const { theme } = useTheme();
  const dialog = useDialog();
  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getAuthUser);
  const userExpired = useSelector(authSelectors.getUserExpired);
  const isAppLocked = useSelector(authSelectors.getIsAppLocked);
  const [pinVersion, setPinVersion] = useState(0);
  const [passwordFallback, setPasswordFallback] = useState(false);
  const [askForPin, setAskForPin] = useState(false);
  const previousUserId = useRef<string | null | undefined>(undefined);
  const pinConfigured = useMemo(
    () => (user?.id ? hasPin(user.id) : false),
    [user?.id, pinVersion]
  );
  useInactivityLock(pinVersion);
  const { updateRequired } = useVersionCheck();
  const [freeMemory, setFreeMemory] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const [updateRegistration, setUpdateRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  // ---- Service worker update detection ----
  useEffect(() => {
    const handleSwUpdate = (event: Event) => {
      const { registration } = (event as CustomEvent).detail;
      setUpdateRegistration(registration);
    };
    window.addEventListener('sw-update', handleSwUpdate);

    // Safety net: if the SW already installed and is waiting before this
    // listener was attached (e.g. the sw-update event fired before mount),
    // pick it up directly from the ready registration.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setUpdateRegistration(registration);
        }
      });
    }

    return () => window.removeEventListener('sw-update', handleSwUpdate);
  }, []);

  const isSslEnabled = window.location.protocol === 'https:';
  const applicationVersion = useSelector(
    settingSelectors.getApplicationVersion
  );
  const currentBuildVersion: string = import.meta.env.REACT_APP_VERSION;

  // Latch at mount time so the UpdateRequired screen stays visible after we
  // update the stored version (preventing a reload loop when user hits "Update now").
  const [versionMismatch] = useState(() =>
    Boolean(applicationVersion && applicationVersion !== currentBuildVersion)
  );

  // Update the stored version immediately so that after the user reloads via
  // UpdateRequired the mismatch check starts clean.
  useEffect(() => {
    if (versionMismatch) {
      dispatch(settingActions.setApplicationVersion(currentBuildVersion));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTitle = () => {
    const env = import.meta.env.REACT_APP_RUNENVIRONMENT || '';
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
                !!import.meta.env.REACT_APP_GADEBUGMODE,
            },
            gtagOptions: {
              debug_mode:
                window.location.host.indexOf('localhost') > 0 ||
                !!import.meta.env.REACT_APP_GADEBUGMODE,
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
    const previous = previousUserId.current;
    const current = user?.id ?? null;
    previousUserId.current = current;

    if (!current) {
      setAskForPin(false);
      setPasswordFallback(false);
      return;
    }

    const justLoggedIn = previous !== undefined && previous !== current;
    if (justLoggedIn && user?.isTempUser !== true && !hasPin(current)) {
      setAskForPin(true);
    }
  }, [user?.id, user?.isTempUser, pinVersion]);

  useEffect(() => {
    if (!isAppLocked || (pinConfigured && !passwordFallback)) return;

    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onSubmit) => {
        return (
          <LoginModal
            title={
              passwordFallback
                ? 'Enter your password'
                : 'Your session has expired'
            }
            detail={
              passwordFallback
                ? 'Log in with your password to continue. You can choose a new PIN afterwards.'
                : 'If you would like to continue, please re-login or reset'
            }
            onBack={
              passwordFallback
                ? () => {
                    setPasswordFallback(false);
                    onSubmit();
                  }
                : undefined
            }
            loginSuccessful={() => {
              unstable_batchedUpdates(() => {
                if (passwordFallback && user?.id) {
                  clearPin(user.id);
                  setPinVersion((version) => version + 1);
                  setAskForPin(true);
                }
                touchActivity();
                setPasswordFallback(false);
                dispatch(authActions.unlockApp());
              });
              onSubmit();
            }}
          />
        );
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAppLocked, pinConfigured, passwordFallback]);

  useEffect(() => {
    if (freeMemory !== 0 && freeMemory <= 200) {
      setErrorMessage(true);
      // Optionally block form or show message immediately
    }
  }, [freeMemory]);

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

  useEffect(() => {
    const handleGraphQlUserError = (e: Event) => {
      const message =
        (e as CustomEvent<{ message?: string }>).detail?.message ||
        'Something went wrong. Please try again.';

      dialog({
        blocking: false,
        position: DialogPosition.Middle,
        color: 'bg-white',
        render: (onClose) => (
          <ActionModal
            iconColor="alertMain"
            iconBorderColor="errorBg"
            title={message}
            detailText="Please try again, or go back and open the statement from the list."
            icon={'ExclamationCircleIcon'}
            actionButtons={[
              {
                colour: 'quatenary',
                text: 'OK',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'CheckCircleIcon',
                onClick: onClose,
              },
            ]}
          />
        ),
      });
    };

    window.addEventListener('graphql-user-error', handleGraphQlUserError);
    return () => {
      window.removeEventListener('graphql-user-error', handleGraphQlUserError);
    };
  }, [dialog]);

  const isProduction = import.meta.env.PROD;

  const routerContent = (
    <IonReactRouter>
      <AppErrorHandler enabled={!isProduction}>
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

      {updateRequired || updateRegistration || versionMismatch ? (
        <UpdateRequired />
      ) : (
        <>
          {routerContent}
          {user?.id &&
            user.isTempUser !== true &&
            askForPin &&
            !pinConfigured &&
            !isAppLocked && (
              <PinSetup
                userId={user.id}
                onComplete={() => {
                  setAskForPin(false);
                  setPinVersion((version) => version + 1);
                }}
                onSkip={() => setAskForPin(false)}
              />
            )}
          {user?.id &&
            user.isTempUser !== true &&
            isAppLocked &&
            pinConfigured &&
            !passwordFallback && (
              <PinUnlock
                userId={user.id}
                onUnlock={() => {
                  touchActivity();
                  dispatch(authActions.unlockApp());
                }}
                onUsePassword={() => setPasswordFallback(true)}
              />
            )}
        </>
      )}
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
