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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { useStoreSetup } from '../../../hooks/useStoreSetup';
import { initialLoginValues, LoginModel, loginSchema } from '../../../schemas/auth/login/login';
import { useAppDispatch } from '../../../store';
import { authActions, authThunkActions } from '../../../store/auth';
import { settingActions } from '../../../store/settings';
import * as styles from './login-modal.styles';
const { version } = require('../../../../package.json');

interface LoginModalProps {
  loginSuccessful: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ loginSuccessful }) => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFieldVisible, setIdFieldVisible] = useState(true);
  const { resetAuth, resetAppStaticStores } = useStoreSetup();

  const { isOnline, Offline } = useOnlineStatus();

  const {
    register: loginRegister,
    setValue: loginSetValue,
    formState: loginFormState,
    getValues: loginFormGetValues,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: initialLoginValues,
    mode: 'onChange',
  });
  const { isValid } = loginFormState;

  const submitForm = async () => {
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
          if (isAuthenticated && isAuthenticated?.payload?.response?.status !== 401) {
            loginSuccessful();
            await appDispatch(settingActions.setApplicationVersion(version));
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
    }
  };

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
          paragraphs={['If you would like to continue, please re-login or reset']}
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
          <Offline>
            <Alert
              className={'mt-5 mb-3'}
              title="You are offline"
              message={'You need to be online to log in to the app'}
              type={'warning'}
            />
          </Offline>

          <Button
            className={'w-full mt-3'}
            type="filled"
            isLoading={isLoading}
            color="primary"
            disabled={!isValid || !isOnline}
            onClick={submitForm}
          >
            <Typography type="help" color="white" text={'Log in'}></Typography>
          </Button>

          <Button
            className={'w-full mt-3'}
            type="filled"
            color="alertMain"
            onClick={async () => {
              await resetAuth();
              await resetAppStaticStores();
              history.push('/login');
            }}
          >
            <Typography type="help" color="white" text={'Reset & Go back to login'}></Typography>
          </Button>
        </form>
      </div>
    </div>
  );
};
