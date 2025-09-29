import {
  LoginRequestModel,
  Config,
  LocalStorageKeys,
  useDialog,
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
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
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
import { AuthService } from '@/services/AuthService';
import { VerifyPhoneNumberAuthCode } from '@/components/user-registration/components/verify-phone-number';
import { useTenant } from '@/hooks/useTenant';
import { getLogo, LogoSvgs } from '@/utils/common/svg.utils';
import { HelpForm } from '@/components/help-form/help-form';

const CryptoJS = require('crypto-js');
const { version } = require('../../../../package.json');

export const OaLogin: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
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

  const ERROR_NONE = '';
  const ERROR_DETAILS_INCORRECT =
    'Password or username incorrect. Please try again.';
  const ERROR_STRUGGLING_LOGIN = tenant.isOpenAccess
    ? 'Struggling to log in? Send a message to our help line!'
    : 'Struggling to log in? Please fill in the help form.';
  const ERROR_USER_ALREADY_LOGGED_IN = `Another user is already logged in on this device. Please try again ${
    isOnline ? '' : 'when you are online'
  }`;
  const STRUGGLING_LOGIN_ATTEMPTS = 5;

  navigator?.storage?.estimate().then((estimate) => {
    if (estimate?.quota) {
      const freMemoryResult = estimate?.quota / 1024 / 1024;
      setFreeMemory(Number(freMemoryResult.toFixed(0)));
      return estimate;
    }
  });

  const whatsapp = () => {
    window.open(
      `https://wa.me/${tenant.tenant?.organisationHelpWhatsAppNumber}`
    );
  };

  const {
    register: loginRegister,
    formState: loginFormState,
    getValues: loginFormGetValues,
    control,
  } = useForm({
    resolver: yupResolver(oaLoginSchema),
    defaultValues: initialOaLoginValues,
    mode: 'onChange',
  });
  const { isValid, errors } = loginFormState;
  const { username, password } = useWatch({ control });
  const dialog = useDialog();

  const userHash = CryptoJS.AES.encrypt(password, 'user pass').toString();
  const userIdHash = CryptoJS.AES.encrypt(username, 'user id').toString();
  const userLocalxpiration = Date.now() + 3600000000;
  const currentUserId = JSON.parse(localStorage?.getItem('userIdHash')!);
  const [openVerifyPhoneNumber, setOpenVerifyPhoneNumber] = useState(false);

  const userIdHashDecrypted = useMemo(
    () => (currentUserId ? CryptoJS.AES.decrypt(currentUserId, 'user id') : ''),
    [currentUserId]
  );
  const userIdHashDecryptedToString = useMemo(
    () =>
      userIdHashDecrypted
        ? userIdHashDecrypted.toString(CryptoJS.enc.Utf8)
        : '',
    [userIdHashDecrypted]
  );

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

  const checkSyncData = async () => {
    if (
      username !== userIdHashDecryptedToString &&
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

  const checkUserAuthCode = async () => {
    setIsLoading(true);
    const result = await new AuthService()
      .VerifyOaAuthCodeStatus(Config.authApi, {
        username: loginFormGetValues().username,
      })
      .catch((error) => {
        setIsLoading(false);
      });
    setIsLoading(false);
    return result;
  };

  const submitForm = async () => {
    setDisplayError(ERROR_NONE);

    const userAuthCode = await checkUserAuthCode();

    if (isValid) {
      if (freeMemory > 200 || freeMemory === 0) {
        setIsLoading(true);
        const body: LoginRequestModel = {
          username: loginFormGetValues().username,
          password: loginFormGetValues().password,
        };

        if (currentUserId && !isOnline) {
          if (username === userIdHashDecryptedToString) {
            setDisplayError(ERROR_NONE);
            login();
          } else {
            setLoginAttempts(loginAttempts + 1);
            setDisplayError(
              loginAttempts + 1 >= STRUGGLING_LOGIN_ATTEMPTS
                ? ERROR_STRUGGLING_LOGIN
                : ERROR_USER_ALREADY_LOGGED_IN
            );
            setIsLoading(false);
          }

          return;
        }

        await checkSyncData();

        localStorage.setItem('userHash', JSON.stringify(userHash));
        localStorage.setItem('userIdHash', JSON.stringify(userIdHash));
        localStorage.setItem(
          'userLocalxpiration',
          JSON.stringify(userLocalxpiration)
        );

        setDisplayError(ERROR_NONE);
        appDispatch(authThunkActions.login(body))
          .then((isAuthenticated: any) => {
            if (
              isAuthenticated &&
              isAuthenticated?.error === undefined &&
              isAuthenticated?.payload?.response?.status !== 401
            ) {
              if (userAuthCode === true) {
                setOpenVerifyPhoneNumber(true);
                return;
              }
              login();
            } else {
              setLoginAttempts(loginAttempts + 1);
              setDisplayError(
                loginAttempts + 1 >= STRUGGLING_LOGIN_ATTEMPTS
                  ? ERROR_STRUGGLING_LOGIN
                  : ERROR_DETAILS_INCORRECT
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
                ? ERROR_STRUGGLING_LOGIN
                : ERROR_DETAILS_INCORRECT
            );
            setIsLoading(false);
          });
      } else {
        setErrorMessage(true);
      }
    }
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

  const backToPromptScreen = () => {
    history.push('/');
  };

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
                  displayError === ERROR_STRUGGLING_LOGIN ? (
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
