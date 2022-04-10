import { useTheme, LoginRequestModel } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  BannerWrapper,
  Button,
  Divider,
  FormInput,
  PasswordInput,
  Typography,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as styles from './login.styles';
import { initialLoginValues, LoginModel, loginSchema } from '@schemas/auth/login/login';
import { useAppDispatch } from '@store';
import { authActions, authThunkActions } from '@store/auth';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { settingActions } from '@store/settings';
const { version } = require('../../../../package.json');

export const Login: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFieldVisible, setIdFieldVisible] = useState(true);

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
  const { isValid, errors } = loginFormState;

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
        .then((isAuthenticated: any) => {
          if (isAuthenticated && isAuthenticated?.payload?.response?.status !== 401) {
            appDispatch(settingActions.setApplicationVersion(version));
            appDispatch(authActions.setUserExpired());
            history.push('/dashboard');
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

  const forgotPasswordClicked = () => {
    history.push('/password-reset');
  };

  const toggleIdAndpassport = (visible: boolean) => {
    const flag = !visible;
    loginSetValue(flag ? 'passportField' : 'idField', '');
    loginSetValue('preferId', flag);
    setIdFieldVisible(flag);
  };

  const { theme } = useTheme();

  return (
    <BannerWrapper
      showBackground={true}
      backgroundUrl={theme?.images.graphicOverlayUrl}
      backgroundImageColour={'primary'}
      color="primary"
      size="sub-normal"
      renderBorder={false}
      displayOffline={!isOnline}
    >
      <div className={styles.loginContainer}>
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
            <div>
              <Button
                className={'mt-1 mb-3'}
                type="outlined"
                color="primary"
                background={'transparent'}
                size="small"
                disabled={!isOnline}
                onClick={forgotPasswordClicked}
              >
                <Typography type="small" color="primary" text={'Forgot my password'}></Typography>
              </Button>
            </div>
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
            id="gtm-login"
            className={'w-full mt-3'}
            type="filled"
            isLoading={isLoading}
            color="primary"
            disabled={!isValid || !isOnline}
            onClick={submitForm}
          >
            <Typography type="help" color="white" text={'Log in'}></Typography>
          </Button>
        </form>
      </div>
    </BannerWrapper>
  );
};
