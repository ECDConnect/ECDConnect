import {
  LoginRequestModel,
  LocalStorageKeys,
  useDialog,
  LoginType,
  Config,
} from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  BannerWrapper,
  Button,
  Divider,
  FormInput,
  PasswordInput,
  Typography,
  Dialog,
  DialogPosition,
  ActionModal,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router';
import * as styles from './oa-login.styles';
import { useAppDispatch } from '@store';
import { authActions, authThunkActions } from '@store/auth';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { settingActions } from '@store/settings';
import ROUTES from '@routes/routes';
import { StorageFull } from './storage-full/storage-full';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { syncThunkActions } from '@/store/sync';
import { useStoreSetup } from '@/hooks/useStoreSetup';
import { userThunkActions } from '@/store/user';
import ReactGA from 'react-ga4';
import {
  OaLoginModel,
  initialOaLoginValues,
  oaLoginSchema,
} from '@/schemas/auth/login/oa-login';
import { VerifyPhoneNumberAuthCode } from '@/components/user-registration/components/verify-phone-number';
import { useTenant } from '@/hooks/useTenant';
import { getLogo, LogoSvgs } from '@/utils/common/svg.utils';
import { HelpForm } from '@/components/help-form/help-form';
import {
  /*CodeResponse,*/
  CredentialResponse,
  GoogleLogin /*,
  useGoogleLogin,*/,
} from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { Login as FacebookLogin } from 'react-facebook';
import { LoginResponse } from '@/types/facebook';
import { triggerBackgroundSync } from '@/store/sync/sync.actions';

const CryptoJS = require('crypto-js');
const version: string =
  process.env.REACT_APP_VERSION ?? require('../../../../package.json').version;

enum LoginErrorEnum {
  None,
  DetailsIncorrect,
  StrugglingLogin,
  UserAlreadyLoggedIn,
}

interface LoginRouteState {
  username?: string;
  password?: string;
  loginType?: LoginType;
  googleToken?: string;
  facebookToken?: string;
}

export const OaLogin: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { state } = useLocation<LoginRouteState>();
  const [displayError, setDisplayError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isOnline } = useOnlineStatus();
  const [freeMemory, setFreeMemory] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const tenant = useTenant();
  const { resetAppStore, resetAuth, resetUser } = useStoreSetup();

  const [autoLogin, setAutoLogin] = useState(
    !!state?.username && !!state?.loginType
  );

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const isSslEnabled = window.location.protocol === 'https:';

  const getDisplayErrorMessage = (
    loginError: LoginErrorEnum,
    loginType?: LoginType
  ): string => {
    switch (loginError) {
      case LoginErrorEnum.None:
        return '';
      case LoginErrorEnum.DetailsIncorrect:
        return loginType === 'username'
          ? 'Password or username incorrect. Please try again.'
          : '';
      case LoginErrorEnum.StrugglingLogin:
        return tenant.isOpenAccess
          ? 'Struggling to log in? Send a message to our help line!'
          : 'Struggling to log in? Please fill in the help form.';
      case LoginErrorEnum.UserAlreadyLoggedIn:
        return `Another user is already logged in on this device. Please try again ${
          isOnline ? '' : 'when you are online'
        }`;
    }
  };

  const STRUGGLING_LOGIN_ATTEMPTS = 5;

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

  const whatsapp = () => {
    window.open(
      `https://wa.me/${tenant.tenant?.organisationHelpWhatsAppNumber}`
    );
  };

  const {
    register: loginRegister,
    formState: loginFormState,
    getValues: loginFormGetValues,
  } = useForm({
    resolver: yupResolver(oaLoginSchema),
    defaultValues:
      state?.loginType === 'username'
        ? ({
            username: state?.username || '',
            password: state?.password || '',
          } as OaLoginModel)
        : initialOaLoginValues,
    mode: 'onChange',
  });
  const { isValid, errors } = loginFormState;
  const dialog = useDialog();

  const userLocalxpiration = Date.now() + 3600000000;
  const [openVerifyPhoneNumber, setOpenVerifyPhoneNumber] = useState(false);

  const getCurrentUserId = (): string => {
    const userIdHash = localStorage.getItem('userIdHash') || '';
    if (!userIdHash) return '';
    const currentUserId = JSON.parse(userIdHash);
    return currentUserId;
  };

  const decryptCurrentUserId = (): string => {
    const currentUserId = getCurrentUserId();
    const d = currentUserId
      ? CryptoJS.AES.decrypt(currentUserId, 'user id')
      : '';
    const s = d ? d.toString(CryptoJS.enc.Utf8) : '';
    return s;
  };

  const displayNoAccountFoundPopup = (loginType: LoginType) => {
    const name = loginType.charAt(0).toUpperCase() + loginType.slice(1);
    const title = `No account for this ${name} login`;
    const detailText = tenant.isOpenAccess
      ? `This ${name} account isn't linked to ECD Connect.  
        Already have an account? Log in with your email and password. New here? Sign up first.`
      : `Please register for the app first.
        Check your SMS for a registration link. If you didn't receive an SMS, tap Get help`;

    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      color: 'bg-white',
      render: (onSubmit, onCancel) => {
        return (
          <ActionModal
            className={'mx-4'}
            title={title}
            detailText={detailText}
            icon={'ExclamationCircleIcon'}
            iconSize={48}
            iconColor={'alertMain'}
            // iconBorderColor={'white'}
            actionButtons={
              tenant.isOpenAccess
                ? [
                    {
                      text: 'Sign up',
                      colour: 'quatenary',
                      type: 'filled',
                      onClick: () => {
                        onSubmit();
                        history.push(ROUTES.OA_SIGN_UP_OR_LOGIN, {
                          signup: true,
                        });
                      },
                      textColour: 'white',
                    },
                    {
                      text: 'Log in',
                      colour: 'quatenary',
                      type: 'outlined',
                      onClick: () => {
                        setAutoLogin(false);
                        onSubmit();
                      },
                      textColour: 'quatenary',
                    },
                  ]
                : [
                    {
                      text: 'Get help',
                      colour: 'quatenary',
                      type: 'filled',
                      onClick: () => {
                        setOpenHelp(true);
                        onSubmit();
                      },
                      textColour: 'white',
                      leadingIcon: 'QuestionMarkCircleIcon',
                    },
                    {
                      text: 'Close',
                      colour: 'quatenary',
                      type: 'outlined',
                      onClick: () => {
                        setAutoLogin(false);
                        onSubmit();
                      },
                      textColour: 'quatenary',
                    },
                  ]
            }
          />
        );
      },
    });
  };

  const login = async () => {
    appDispatch(settingActions.setApplicationVersion(version));
    appDispatch(authActions.setUserExpired());
    appDispatch(settingActions.setLoginDate());
    const user = await appDispatch(userThunkActions.getUser({})).unwrap();
    localStorage.setItem(
      LocalStorageKeys.firstTimeOnCommunityDashboard,
      'true'
    );
    setIsLoading(false);
    setLoginAttempts(0);
    // Set userId for google
    ReactGA.set({ userId: user?.id });
    history.push(ROUTES.DASHBOARD, { isFromLogin: true });
  };

  const checkSyncData = async (username: string) => {
    if (
      username !== decryptCurrentUserId() &&
      !!practitioner /* &&
      isOnline*/
    ) {
      await appDispatch(
        triggerBackgroundSync({ includeOfflineSyncData: true })
      );

      resetAppStore && (await resetAppStore());
      resetAuth && (await resetAuth());
      resetUser && (await resetUser());
    }
  };

  const loginOffline = async (loginRequest: LoginRequestModel) => {
    const decryptedCurrentUserId = decryptCurrentUserId();
    if (loginRequest.username === decryptedCurrentUserId) {
      setDisplayError(getDisplayErrorMessage(LoginErrorEnum.None));
      login();
    } else {
      setLoginAttempts(loginAttempts + 1);
      setDisplayError(
        loginAttempts + 1 >= STRUGGLING_LOGIN_ATTEMPTS
          ? getDisplayErrorMessage(LoginErrorEnum.StrugglingLogin)
          : getDisplayErrorMessage(LoginErrorEnum.UserAlreadyLoggedIn)
      );
      setIsLoading(false);
    }
  };

  const submitForm = async () => {
    setDisplayError(getDisplayErrorMessage(LoginErrorEnum.None));

    if (!(freeMemory > 200 || freeMemory === 0)) {
      setAutoLogin(false);
      setErrorMessage(true);
      return;
    }

    if (!isValid) {
      setAutoLogin(false);
      return;
    }

    const loginRequest: LoginRequestModel = {
      username: loginFormGetValues().username,
      password: loginFormGetValues().password,
      loginType: 'username',
    };

    const currentUserId = getCurrentUserId();
    if (currentUserId && !isOnline) {
      await loginOffline(loginRequest);
      return;
    }

    await preLogin(loginRequest);
  };

  const preLogin = async (loginRequest: LoginRequestModel) => {
    setIsLoading(true);

    await checkSyncData(loginRequest.username || '');

    localStorage.setItem('userHash', '');
    localStorage.setItem('userIdHash', '');

    setDisplayError(getDisplayErrorMessage(LoginErrorEnum.None));
    appDispatch(authThunkActions.login(loginRequest))
      .then((isAuthenticated: any) => {
        if (
          isAuthenticated &&
          isAuthenticated?.error === undefined &&
          isAuthenticated?.payload?.response?.status !== 401
        ) {
          const userHash = CryptoJS.AES.encrypt(
            loginRequest.password,
            'user pass'
          ).toString();
          const userIdHash = CryptoJS.AES.encrypt(
            loginRequest.username,
            'user id'
          ).toString();

          localStorage.setItem('userHash', JSON.stringify(userHash));
          localStorage.setItem('userIdHash', JSON.stringify(userIdHash));
          localStorage.setItem(
            'userLocalxpiration',
            JSON.stringify(userLocalxpiration)
          );

          if (isAuthenticated.payload.userMustConfirmAuthCode === true) {
            setOpenVerifyPhoneNumber(true);
            return;
          }
          login();
        } else {
          setLoginAttempts(loginAttempts + 1);
          setDisplayError(
            loginAttempts + 1 >= STRUGGLING_LOGIN_ATTEMPTS
              ? getDisplayErrorMessage(LoginErrorEnum.StrugglingLogin)
              : getDisplayErrorMessage(
                  LoginErrorEnum.DetailsIncorrect,
                  loginRequest?.loginType
                )
          );
          setIsLoading(false);
          if (isAuthenticated?.payload?.lockedOut === true) {
            displayUserLockedOutPopup();
          } else {
            if (
              !!loginRequest?.loginType &&
              loginRequest?.loginType !== 'username'
            ) {
              displayNoAccountFoundPopup(loginRequest?.loginType);
            }
          }
        }
      })
      .catch((err) => {
        setLoginAttempts(loginAttempts + 1);
        setDisplayError(
          loginAttempts + 1 >= STRUGGLING_LOGIN_ATTEMPTS
            ? getDisplayErrorMessage(LoginErrorEnum.StrugglingLogin)
            : getDisplayErrorMessage(
                LoginErrorEnum.DetailsIncorrect,
                loginRequest?.loginType
              )
        );
        if (!!loginRequest?.loginType && loginRequest?.loginType !== username) {
          displayNoAccountFoundPopup(loginRequest?.loginType);
        }
        setIsLoading(false);
        setAutoLogin(false);
      });
  };

  const forgotPasswordClicked = () => {
    history.push(ROUTES.PASSWORD_RESET);
  };

  const displayIncorrectBrowserPopup = () => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      fullOverlay: true,
      render: (onSubmit) => {
        return (
          <ActionModal
            className={'mx-4'}
            title={`Oops! ${tenant?.tenant?.applicationName} works best on Chrome or Firefox`}
            detailText={`To download Chrome or Firefox, go to your phone's app store.`}
            icon={'ExclamationIcon'}
            iconSize={48}
            iconColor={'alertMain'}
            iconBorderColor={'white'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => onSubmit(),
                textColour: 'white',
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const displayUserLockedOutPopup = () => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className={'mx-4'}
            title={`Oops! Too many login attempts!`}
            detailText={
              tenant.isOpenAccess
                ? 'Please try again later. If you are still struggling, please send a message to our helpline.'
                : 'Please try again later. If you are still struggling, please fill in the help form.'
            }
            icon={'ExclamationCircleIcon'}
            iconSize={48}
            iconColor={'alertMain'}
            iconBorderColor={'white'}
            actionButtons={[
              {
                text: 'Get help',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => onClickGetHelp(onClose),
                textColour: 'white',
                leadingIcon: tenant.isOpenAccess
                  ? getLogo(LogoSvgs.whatsappWhite)
                  : 'QuestionMarkCircleIcon',
                leadingIconType: tenant.isOpenAccess ? 'img' : 'hero',
              },
            ]}
          />
        );
      },
    });
  };

  const onClickGetHelp = (onClose?: () => void) => {
    if (tenant.isOpenAccess) {
      whatsapp();
    } else {
      setOpenHelp(true);
    }
    if (onClose) onClose();
  };

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    const isChromeLike = ua.includes('chrome/') || ua.includes('crios/');

    const isIosSafari =
      /iphone|ipad|ipod/.test(ua) &&
      ua.includes('safari/') &&
      !ua.includes('crios/') &&
      !ua.includes('fxios/') &&
      !ua.includes('opios/');

    const isFirefox = ua.includes('firefox/') || ua.includes('fxios/');

    const isAllowed = isChromeLike || isIosSafari || isFirefox;

    if (!isAllowed) {
      displayIncorrectBrowserPopup();
    }

    // Optional debug
    console.log({
      ua,
      isChromeLike,
      isIosSafari,
      isAllowed,
    });
  }, []);

  useEffect(() => {
    setAutoLogin(
      (state?.loginType === 'username' && isValid) ||
        state?.loginType === 'google' ||
        state?.loginType === 'facebook'
    );
    if (state?.loginType === 'username' && isValid) {
      submitForm();
    } else if (state?.loginType === 'google') {
      preLogin({
        username: state?.username,
        password: '',
        googleToken: state?.googleToken,
        loginType: state?.loginType,
      });
    } else if (state?.loginType === 'facebook') {
      preLogin({
        username: state?.username,
        password: '',
        facebookToken: state?.facebookToken,
        loginType: state?.loginType,
      });
    }
  }, [state, isValid]);

  useEffect(() => {
    if (freeMemory !== 0 && freeMemory <= 200) {
      setAutoLogin(false);
      setErrorMessage(true);
      // Optionally block form or show message immediately
    }
  }, [freeMemory]);

  const backToPromptScreen = () => {
    history.push('/');
  };

  const onGoogleLoginSuccess = (response: CredentialResponse) => {
    const credential = response.credential || '';
    const decoded = jwtDecode<any>(credential);
    const email = decoded.email;
    preLogin({
      username: email,
      password: '',
      googleToken: credential,
      loginType: 'google',
    });
  };

  const onGoogleLoginError = () => {
    console.log('Google Login failed.');
  };

  const onFacebookLoginSuccess = (response: LoginResponse) => {
    const { userID, accessToken } = response.authResponse;
    preLogin({
      username: userID,
      password: '',
      facebookToken: accessToken,
      loginType: 'facebook',
    });
  };

  const onFacebookLoginError = (error: Error) => {
    console.log('Facebook login failed', error);
  };

  const username = loginFormGetValues().username || '';
  const password = loginFormGetValues().password || '';

  return (
    <BannerWrapper
      showBackground={false}
      backgroundImageColour={'primary'}
      color="primary"
      size={tenant.isOpenAccess ? 'small' : 'sub-normal'}
      renderBorder={false}
      displayOffline={!isOnline}
      onBack={tenant.isOpenAccess ? backToPromptScreen : undefined}
    >
      <div className={styles.loginContainer}>
        <Dialog fullScreen visible={errorMessage} position={DialogPosition.Top}>
          <StorageFull />
        </Dialog>
        {!autoLogin && isOnline && (
          <div className="mb-6">
            {!!Config.googleClientId && (
              <div className="mb-6 flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) =>
                    onGoogleLoginSuccess(credentialResponse)
                  }
                  onError={() => onGoogleLoginError()}
                  type="standard"
                  text="signin_with"
                  logo_alignment="center"
                  size="large"
                  width={250}
                />
              </div>
            )}
            {!!Config.facebookAppId && isSslEnabled && (
              <div className="mb-6 flex justify-center">
                <FacebookLogin
                  onSuccess={(response: any) =>
                    onFacebookLoginSuccess(response)
                  }
                  onError={(error: Error) => onFacebookLoginError(error)}
                  fields={['id', 'name', 'picture']}
                  scope={['public_profile']}
                  //className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  className="flex h-10 items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                  disabled={isLoading}
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                  <span>Login with Facebook</span>
                </FacebookLogin>
              </div>
            )}
            <Divider title="OR" />
          </div>
        )}
        <form>
          <div>
            <FormInput<OaLoginModel>
              label={'Username or email'}
              visible={true}
              nameProp={'username'}
              error={errors['username']}
              register={loginRegister}
              placeholder="e.g. Nothando_123@gmail.com"
              className="my-2"
              disabled={autoLogin}
            />
            <PasswordInput<OaLoginModel>
              label={'Password'}
              className={'mt-1 mb-2'}
              nameProp={'password'}
              sufficIconColor={'uiMidDark'}
              value={loginFormGetValues().password}
              register={loginRegister}
              disabled={autoLogin}
            />
            <div>
              <Button
                className={'mt-1 mb-3'}
                type="outlined"
                color="secondary"
                background={'transparent'}
                size="small"
                disabled={!isOnline || autoLogin}
                onClick={forgotPasswordClicked}
              >
                <Typography
                  type="buttonSmall"
                  color="secondary"
                  text={'Forgot my password/username'}
                ></Typography>
              </Button>
            </div>
            <Divider></Divider>
            {!!displayError && (
              <Alert
                className={'mt-5 mb-3'}
                title={displayError}
                type={'error'}
                button={
                  displayError ===
                  getDisplayErrorMessage(LoginErrorEnum.StrugglingLogin) ? (
                    <Button
                      text="Get help"
                      icon={
                        tenant.isOpenAccess
                          ? getLogo(LogoSvgs.whatsappWhite)
                          : 'QuestionMarkCircleIcon'
                      }
                      iconType={tenant.isOpenAccess ? 'img' : 'hero'}
                      type={'filled'}
                      color={'quatenary'}
                      textColor={'white'}
                      onClick={() => onClickGetHelp()}
                    />
                  ) : undefined
                }
              />
            )}
          </div>
          {!isOnline && (
            <Alert
              className={'mt-5 mb-3'}
              title="Your internet connection is unstable."
              type={'warning'}
            />
          )}
          <Button
            id="gtm-login"
            className={'mt-3 mb-8 w-full'}
            type="filled"
            isLoading={isLoading}
            color="quatenary"
            disabled={!isValid}
            onClick={submitForm}
          >
            <Typography type="help" color="white" text={'Log in'}></Typography>
          </Button>
        </form>
        {username && (
          <Dialog
            visible={openVerifyPhoneNumber}
            position={DialogPosition.Full}
            className="w-full"
            stretch
          >
            <VerifyPhoneNumberAuthCode
              closeAction={setOpenVerifyPhoneNumber}
              username={username}
              password={password as string}
            />
          </Dialog>
        )}
        <Dialog
          visible={openHelp}
          position={DialogPosition.Full}
          className="w-full"
          stretch
        >
          <HelpForm closeAction={setOpenHelp} />
        </Dialog>
      </div>
    </BannerWrapper>
  );
};
