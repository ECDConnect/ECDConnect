import { useTheme, LoginRequestModel, useDialog } from '@ecdlink/core';
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
import * as styles from './login.styles';
import {
  initialLoginValues,
  LoginModel,
  loginSchema,
} from '@schemas/auth/login/login';
import { useAppDispatch } from '@store';
import { authActions, authThunkActions } from '@store/auth';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { settingActions } from '@store/settings';
import ROUTES from '@routes/routes';
import { StorageFull } from './storage-full/storage-full';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { syncThunkActions } from '@/store/sync';
import { userThunkActions } from '@/store/user';
import { useStoreSetup } from '@/hooks/useStoreSetup';
import { useTenant } from '@/hooks/useTenant';
import TransparentLayer from '../../../assets/TransparentLayer.png';
import ReactGA from 'react-ga4';

var CryptoJS = require('crypto-js');
const { version } = require('../../../../package.json');

export const Login: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();
  const [displayError, setDisplayError] = useState(false);
  const displayMessage = 'Password or ID incorrect. Please try again';
  const [displayWrongUserError, setDisplayWrongUserError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFieldVisible, setIdFieldVisible] = useState(true);
  const { isOnline } = useOnlineStatus();
  const [freeMemory, setFreeMemory] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  // const [incorrectBrowser, setIncorrectBrowser] = useState(false);
  const tenant = useTenant();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { resetAppStore, resetAuth } = useStoreSetup();

  useEffect(() => {
    resetAppStore();
  }, []);

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
    setValue: loginSetValue,
    formState: loginFormState,
    getValues: loginFormGetValues,
    control,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: initialLoginValues,
    mode: 'onChange',
  });
  const { isValid, errors } = loginFormState;
  const { idField, passportField, password, preferId } = useWatch({ control });
  const checkIdOrPassport = preferId ? idField : passportField;

  const userHash = CryptoJS.AES.encrypt(password, 'user pass').toString();
  const userIdHash = CryptoJS.AES.encrypt(
    checkIdOrPassport,
    'user id'
  ).toString();
  const userLocalxpiration = Date.now() + 3600000000;
  const currentUserId = JSON.parse(localStorage?.getItem('userIdHash')!);

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
    setIsLoading(false);
    // Set userId for google
    ReactGA.set({ userId: user?.id });

    history.push(ROUTES.DASHBOARD, { isFromLogin: true });
  };

  const checkSyncData = async () => {
    if (
      checkIdOrPassport !== userIdHashDecryptedToString &&
      !!practitioner &&
      isOnline
    ) {
      if (practitioner?.isPrincipal === true) {
        await appDispatch(syncThunkActions.syncOfflineData({}));
      } else {
        await appDispatch(syncThunkActions.syncOfflineDataForPractitioner({}));
      }

      await resetAppStore();
      await resetAuth();
    }
  };

  const submitForm = async () => {
    setDisplayError(false);
    if (isValid) {
      if (freeMemory > 300 || freeMemory === 0) {
        setIsLoading(true);
        const body: LoginRequestModel = {
          username: loginFormGetValues().preferId
            ? loginFormGetValues().idField
            : loginFormGetValues().passportField,
          password: loginFormGetValues().password,
        };

        if (currentUserId && !isOnline) {
          if (checkIdOrPassport === userIdHashDecryptedToString) {
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

  const toggleIdAndpassport = (visible: boolean) => {
    const flag = !visible;
    loginSetValue(flag ? 'passportField' : 'idField', '');
    loginSetValue('preferId', flag);
    setIdFieldVisible(flag);
  };

  const { theme } = useTheme();

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
      showBackground={true}
      backgroundUrl={TransparentLayer}
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
            {idFieldVisible && (
              <FormInput<LoginModel>
                label={'ID number'}
                visible={true}
                nameProp={'idField'}
                register={loginRegister}
                error={errors['idField']}
                placeholder={'E.g. 7601010338089'}
              />
            )}
            {!idFieldVisible && (
              <FormInput<LoginModel>
                label={'Passport number'}
                visible={true}
                nameProp={'passportField'}
                error={errors['passportField']}
                register={loginRegister}
              />
            )}
            {!idFieldVisible && (
              <Button
                className={'mt-3 mb-2'}
                type="outlined"
                color="primary"
                background={'transparent'}
                size="small"
                onClick={() => toggleIdAndpassport(idFieldVisible)}
              >
                <Typography
                  type="buttonSmall"
                  color="primary"
                  text={'Enter ID number instead'}
                ></Typography>
              </Button>
            )}
            {idFieldVisible && (
              <Button
                className={'mt-3 mb-2'}
                type="outlined"
                color="primary"
                size="small"
                background={'transparent'}
                onClick={() => toggleIdAndpassport(idFieldVisible)}
              >
                <Typography
                  type="buttonSmall"
                  color="primary"
                  text={'Enter passport number instead'}
                ></Typography>
              </Button>
            )}
            <PasswordInput<LoginModel>
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
            className={'mt-3 w-full'}
            type="filled"
            isLoading={isLoading}
            color="primary"
            disabled={!isValid}
            onClick={submitForm}
          >
            <Typography type="help" color="white" text={'Log in'}></Typography>
          </Button>
        </form>
      </div>
    </BannerWrapper>
  );
};
