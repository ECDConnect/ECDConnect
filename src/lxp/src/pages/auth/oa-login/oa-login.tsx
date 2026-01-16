import {
  LoginRequestModel,
  LocalStorageKeys,
  useDialog,
  LoginType,
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

const CryptoJS = require('crypto-js');
const { version } = require('../../../../package.json');

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

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const getDisplayErrorMessage = (
    loginError: LoginErrorEnum,
    isGoogle?: boolean
  ): string => {
    switch (loginError) {
      case LoginErrorEnum.None:
        return '';
      case LoginErrorEnum.DetailsIncorrect:
        return isGoogle
          ? 'No user account associated with this Google account. Please try again.'
          : 'Password or username incorrect. Please try again.';
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
            const freeMemoryMB = estimate.quota;
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
    // Set userId for google
    setLoginAttempts(0);
    ReactGA.set({ userId: user?.id });
    history.push(ROUTES.DASHBOARD, { isFromLogin: true });
  };

  const checkSyncData = async (username: string) => {
    if (
      username !== decryptCurrentUserId() &&
      !!practitioner /* &&
      isOnline*/
    ) {
      if (practitioner?.isPrincipal === true) {
        await appDispatch(syncThunkActions.syncOfflineData({}));
      } else {
        await appDispatch(syncThunkActions.syncOfflineDataForPractitioner({}));
      }

      await resetAppStore();
      await resetAuth();
      await resetUser();
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
      setErrorMessage(true);
      return;
    }

    if (!isValid) return;

    const loginRequest: LoginRequestModel = {
      username: loginFormGetValues().username,
      password: loginFormGetValues().password,
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
                  !!loginRequest.googleToken
                )
          );
          setIsLoading(false);
          if (isAuthenticated?.payload?.lockedOut === true) {
            handleUserLockedOut();
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
                !!loginRequest.googleToken
              )
        );
        setIsLoading(false);
      });
  };

  const forgotPasswordClicked = () => {
    history.push(ROUTES.PASSWORD_RESET);
  };

  const handleIncorrectBrowser = () => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onSubmit) => {
        return (
          <ActionModal
            className={'mx-4'}
            title={`Oops! ${tenant?.tenant?.applicationName} works best on Chrome or Firefox`}
            paragraphs={[
              `To download Chrome or Firefox, go to your phone's app store.`,
            ]}
            icon={'ExclamationIcon'}
            iconSize={48}
            iconColor={'alertMain'}
            iconBorderColor={'white'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'quatenary',
                type: 'outlined',
                onClick: () => onSubmit(),
                textColour: 'quatenary',
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const handleUserLockedOut = () => {
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

  const userAgent = navigator.userAgent;

  useEffect(() => {
    if (
      userAgent.includes('Firefox') ||
      (userAgent.includes('Chrome') && !userAgent.includes('Edg'))
    ) {
      return;
    } else {
      handleIncorrectBrowser();
    }
  }, [userAgent]);

  useEffect(() => {
    if (state?.loginType === 'username' && isValid) {
      submitForm();
    } else if (state?.loginType === 'google') {
      preLogin({
        username: state?.username,
        password: '',
        googleToken: state?.googleToken,
      });
    }
  }, [state, isValid]);

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
    });
  };
  const onGoogleLoginError = () => {
    console.log('Google Login failed.');
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
        {isOnline && !!process.env.REACT_APP_GOOGLE_CLIENT_ID && (
          <div className="mb-6">
            <div className="mb-6 flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) =>
                  onGoogleLoginSuccess(credentialResponse)
                }
                onError={() => onGoogleLoginError()}
                type="standard"
                text="signin_with"
                logo_alignment="center"
                size="medium"
                width={300}
              />
            </div>
            {/* <div>
              <Button
                id="gtm-login"
                className={'mt-3 mb-8 w-full'}
                type="outlined"
                isLoading={isLoading}
                color="textLight"
                disabled={false}
                onClick={onGoogleLoginCustom}
              >
                <Typography type="button" color="textDark" text={'Sign in with Google (custom button)'}></Typography>
              </Button>
            </div>*/}
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
            />
            <PasswordInput<OaLoginModel>
              label={'Password'}
              className={'mt-1 mb-2'}
              nameProp={'password'}
              sufficIconColor={'uiMidDark'}
              value={loginFormGetValues().password}
              register={loginRegister}
            />
            <div>
              <Button
                className={'mt-1 mb-3'}
                type="outlined"
                color="secondary"
                background={'transparent'}
                size="small"
                disabled={!isOnline}
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
