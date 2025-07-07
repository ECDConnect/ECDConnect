import {
  useTheme,
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
import facebookLogo from '../../../assets/icon/facebook_white.svg';
import ReactGA from 'react-ga4';
import {
  OaLoginModel,
  initialOaLoginValues,
  oaLoginSchema,
} from '@/schemas/auth/login/oa-login';
import { AuthService } from '@/services/AuthService';
import { VerifyPhoneNumberAuthCode } from '@/components/user-registration/components/verify-phone-number';
import { useTenant } from '@/hooks/useTenant';

var CryptoJS = require('crypto-js');
const { version } = require('../../../../package.json');

export const OaLogin: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const displayMessage = 'Password or ID incorrect. Please try again';
  const [displayWrongUserError, setDisplayWrongUserError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOnline } = useOnlineStatus();
  const [freeMemory, setFreeMemory] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const tenant = useTenant();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { resetAppStore, resetAuth } = useStoreSetup();

  navigator?.storage?.estimate &&
    navigator?.storage?.estimate().then((estimate) => {
      if (estimate?.quota) {
        const freMemoryResult = estimate?.quota / 1024 / 1024;
        setFreeMemory(Number(freMemoryResult.toFixed(0)));
        return estimate;
      }
    });

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
    ReactGA.set({ userId: user?.id });
    history.push(ROUTES.DASHBOARD, { isFromLogin: true });
  };

  const checkSyncData = async () => {
    if (
      username !== userIdHashDecryptedToString &&
      !!practitioner &&
      isOnline
    ) {
      if (practitioner?.isPrincipal === true) {
        await appDispatch(syncThunkActions.syncOfflineData({}));
      } else {
        await appDispatch(syncThunkActions.syncOfflineDataForPractitioner({}));
      }

      // await resetAppStore();
      // await resetAuth();
    }
  };

  const submitForm = async () => {
    setDisplayError(false);
    setIsLoading(true);
    const checkUserAuthCode = await new AuthService()
      .VerifyOaAuthCodeStatus(Config.authApi, {
        username: loginFormGetValues().username,
      })
      .catch((error) => {
        setIsLoading(false);
        return;
      });
    setIsLoading(false);

    if (isValid) {
      if (freeMemory > 200 || freeMemory === 0) {
        setIsLoading(true);
        const body: LoginRequestModel = {
          username: loginFormGetValues().username,
          password: loginFormGetValues().password,
        };

        if (currentUserId && !isOnline) {
          if (username === userIdHashDecryptedToString) {
            setDisplayWrongUserError(false);
            login();
          } else {
            setDisplayWrongUserError(true);
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

        setDisplayWrongUserError(false);
        appDispatch(authThunkActions.login(body))
          .then((isAuthenticated: any) => {
            if (
              isAuthenticated &&
              isAuthenticated?.error === undefined &&
              isAuthenticated?.payload?.response?.status !== 401
            ) {
              if (checkUserAuthCode === true) {
                setOpenVerifyPhoneNumber(true);
                return;
              }
              login();
            } else {
              setDisplayError(true);
              setIsLoading(false);
            }
          })
          .catch((err) => {
            setDisplayError(true);
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

  return (
    <BannerWrapper
      showBackground={false}
      backgroundImageColour={'primary'}
      color="primary"
      size="sub-normal"
      renderBorder={false}
      displayOffline={!isOnline}
    >
      <div className={styles.loginContainer}>
        <Dialog fullScreen visible={errorMessage} position={DialogPosition.Top}>
          <StorageFull />
        </Dialog>
        <form>
          <div>
            {/* <div>
              <Button
                className={'mt-3 w-full rounded-xl'}
                type="filled"
                color="infoMain"
                onClick={() => {}}
                textColor="white"
              >
                <img
                  src={facebookLogo}
                  alt="facebook"
                  className="relative mr-2 h-5 w-5"
                />
                <Typography
                  type={'h4'}
                  text={'Log in with Facebook'}
                  className={'text-sm font-normal'}
                  color={'white'}
                />
              </Button>
            </div>
            <div className="my-8 flex flex-row items-center gap-2">
              <Divider className="absolute w-6/12" />
              <Typography
                type={'h4'}
                text={'OR'}
                className={'text-sm font-normal'}
                color={'textMid'}
              />
              <Divider className="absolute w-6/12" />
            </div> */}
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
                  text={'Forgot my password'}
                ></Typography>
              </Button>
            </div>
            <Divider></Divider>
            {displayError && (
              <Alert
                className={'mt-5 mb-3'}
                title={displayMessage}
                type={'error'}
              />
            )}
            {displayWrongUserError && (
              <Alert
                className={'mt-5 mb-3'}
                message={`Another user is already logged in on this device. Please try again ${
                  isOnline ? '' : 'when you are online'
                }`}
                type={'error'}
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
      </div>
    </BannerWrapper>
  );
};
