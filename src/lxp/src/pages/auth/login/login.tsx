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
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
// import DeviceInfo from 'react-native-device-info';
import { StorageFull } from './storage-full/storage-full';
import packageInfo from '@@/package.json';

export const Login: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFieldVisible, setIdFieldVisible] = useState(true);
  const { isOnline, Offline } = useOnlineStatus();
  const [freeMemory, setFreeMemory] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);

  navigator.storage.estimate().then((estimate) => {
    const freMemoryResult = estimate?.quota! / 1024 / 1024;
    setFreeMemory(Number(freMemoryResult.toFixed(0)));
    return estimate;
  });

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
      if (freeMemory > 50 || freeMemory === 0) {
        setIsLoading(true);
        const body: LoginRequestModel = {
          username: loginFormGetValues().preferId
            ? loginFormGetValues().idField
            : loginFormGetValues().passportField,
          password: loginFormGetValues().password,
        };

        appDispatch(authThunkActions.login(body))
          .then((isAuthenticated: any) => {
            if (
              isAuthenticated &&
              isAuthenticated?.payload?.response?.status !== 401
            ) {
              appDispatch(
                settingActions.setApplicationVersion(packageInfo.version)
              );
              appDispatch(authActions.setUserExpired());
              setIsLoading(false);
              history.push(ROUTES.DASHBOARD);
            } else {
              setDisplayError(true);
              setIsLoading(false);
            }
          })
          .catch(() => {
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
                color="primary"
                background={'transparent'}
                size="small"
                disabled={!isOnline}
                onClick={forgotPasswordClicked}
              >
                <Typography
                  type="buttonSmall"
                  color="primary"
                  text={'Forgot my password'}
                ></Typography>
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
              title="Your internet connection is unstable."
              type={'warning'}
            />
          </Offline>
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
