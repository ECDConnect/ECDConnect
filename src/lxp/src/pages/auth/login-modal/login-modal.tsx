import { LoginRequestModel } from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  Button,
  Divider,
  FormInput,
  PasswordInput,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import {
  initialLoginValues,
  LoginModel,
  loginSchema,
} from '@schemas/auth/login/login';
import { useAppDispatch } from '@store';
import { authActions, authSelectors, authThunkActions } from '@store/auth';
import { settingActions } from '@store/settings';
import * as styles from './login-modal.styles';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { practitionerSelectors } from '@/store/practitioner';
import { syncThunkActions } from '@/store/sync';
const CryptoJS = require('crypto-js');
const { version } = require('../../../../package.json');

interface LoginModalProps {
  loginSuccessful: () => void;
  updateTime?: () => void;
  isLocalExpiration?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  loginSuccessful,
  updateTime,
  isLocalExpiration,
}) => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFieldVisible, setIdFieldVisible] = useState(true);
  const { resetAppStore, resetAuth } = useStoreSetup();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);

  const { isOnline } = useOnlineStatus();

  const [userHashUpdated, setUserHashUpdated] = useState(
    JSON.parse(localStorage?.getItem('userHash')!)
  );

  const userHashDecrypted =
    userHashUpdated && CryptoJS.AES.decrypt(userHashUpdated, 'secret key 123');
  const userHashToString =
    userHashDecrypted && userHashDecrypted.toString(CryptoJS.enc.Utf8);

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
  const { isValid } = loginFormState;
  const { idField, passportField, password, preferId } = useWatch({ control });
  const checkIdOrPassport = preferId ? idField : passportField;
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);

  const sync = async () => {
    if (practitioner?.isPrincipal === true) {
      await appDispatch(syncThunkActions.syncOfflineData({}));
    } else {
      await appDispatch(syncThunkActions.syncOfflineDataForPractitioner({}));
    }
    await appDispatch(settingActions.setLastDataSync());
  };

  const submitForm = async () => {
    if (user?.idNumber !== checkIdOrPassport) {
      await sync();
      await resetAppStore();
      await resetAuth();
      localStorage?.clear();
      history.push(ROUTES.LOGIN);
    }
    setDisplayError(false);
    if (isValid) {
      setIsLoading(true);
      const body: LoginRequestModel = {
        username: loginFormGetValues().preferId
          ? loginFormGetValues().idField
          : loginFormGetValues().passportField,
        password: loginFormGetValues().password,
      };

      appDispatch(authThunkActions.login(body))
        .then(async (isAuthenticated: any) => {
          if (
            isAuthenticated &&
            isAuthenticated?.error === undefined &&
            isAuthenticated?.payload?.response?.status !== 401
          ) {
            loginSuccessful();
            // updateTime()
            const userLocalxpiration = Date.now() + 3600000000;
            localStorage.setItem(
              'userLocalxpiration',
              JSON.stringify(userLocalxpiration)
            );
            await appDispatch(settingActions.setApplicationVersion(version));
            await appDispatch(settingActions.setLoginDate());
            await appDispatch(authActions.setUserExpired());
            setIsLoading(false);
          } else {
            setDisplayError(true);
            setIsLoading(false);
          }
        })
        .catch(() => {
          setDisplayError(true);
          setIsLoading(false);
        });

      setUserHashUpdated(JSON.parse(localStorage?.getItem('userHash')!));
    }
  };

  const offlineSubmitForm = useCallback(async () => {
    if (userHashToString === password && user?.idNumber === checkIdOrPassport) {
      loginSuccessful();
      await appDispatch(settingActions.setApplicationVersion(version));
      await appDispatch(authActions.setUserExpired());
      setIsLoading(false);
    } else {
      setDisplayError(true);
      setIsLoading(false);
    }
  }, [
    appDispatch,
    checkIdOrPassport,
    loginSuccessful,
    password,
    user?.idNumber,
    userHashToString,
  ]);

  const toggleIdAndpassport = (visible: boolean) => {
    const flag = !visible;
    loginSetValue(flag ? 'passportField' : 'idField', '');
    loginSetValue('preferId', flag);
    setIdFieldVisible(flag);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginContainer}>
        <ActionModal
          icon="ExclamationCircleIcon"
          iconBorderColor="errorBg"
          iconColor="errorMain"
          importantText={`Your session has expired`}
          paragraphs={[
            'If you would like to continue, please re-login or reset',
          ]}
        />

        <form>
          <div>
            {idFieldVisible && (
              <FormInput<LoginModel>
                label={'ID number'}
                visible={true}
                nameProp={'idField'}
                register={loginRegister}
                placeholder={'E.g. 7601010338089'}
              />
            )}
            {!idFieldVisible && (
              <FormInput<LoginModel>
                label={'Passport number'}
                visible={true}
                nameProp={'passportField'}
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
                  type="small"
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
                  type="small"
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
            <Divider></Divider>
            {displayError && (
              <Alert
                className={'mt-5 mb-3'}
                message={'Password or ID incorrect. Please try again'}
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
            className={'mt-3 w-full'}
            type="filled"
            isLoading={isLoading}
            color="primary"
            disabled={!isValid || (!userAuth?.auth_token && !isOnline)}
            onClick={
              isLocalExpiration && userAuth?.auth_token
                ? offlineSubmitForm
                : submitForm
            }
          >
            <Typography type="help" color="white" text={'Log in'}></Typography>
          </Button>

          <Button
            className={'mt-3 w-full'}
            type="filled"
            color="alertMain"
            onClick={async () => {
              appDispatch(authActions.resetAuthState());
              resetAppStore && (await resetAppStore());
              history ? history.push(ROUTES.LOGIN) : window.location.reload();
            }}
          >
            <Typography
              type="help"
              color="white"
              text={'Reset & Go back to login'}
            ></Typography>
          </Button>
        </form>
      </div>
    </div>
  );
};
