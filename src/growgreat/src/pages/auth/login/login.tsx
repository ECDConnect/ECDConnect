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
import * as styles from '@/pages/auth/login/login.styles';
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
import { version } from '@@/package.json';

export const Login: React.FC = () => {
  const { theme } = useTheme();

  const history = useHistory();

  const appDispatch = useAppDispatch();

  const { isOnline } = useOnlineStatus();

  const [isLoading, setIsLoading] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [idFieldVisible, setIdFieldVisible] = useState(true);

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

  async function submitForm() {
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
          if (
            isAuthenticated &&
            isAuthenticated?.payload?.response?.status !== 401
          ) {
            appDispatch(settingActions.setApplicationVersion(version));
            appDispatch(authActions.setUserExpired());
            setIsLoading(false);
            history.push(ROUTES.DASHBOARD, { isFromLogin: true });
          } else {
            setDisplayError(true);
            setIsLoading(false);
          }
        })
        .catch((error: unknown) => {
          setDisplayError(true);
          setIsLoading(false);
          console.error(error);
        });
    }
  }

  function forgotPasswordClicked() {
    history.push(ROUTES.PASSWORD_RESET);
  }

  function toggleIdAndpassport(visible: boolean) {
    const flag = !visible;
    loginSetValue(flag ? 'passportField' : 'idField', '');
    loginSetValue('preferId', flag);
    setIdFieldVisible(flag);
  }

  return (
    <BannerWrapper
      size="medium"
      color="primary"
      renderBorder={false}
      showBackground={true}
      displayOffline={!isOnline}
      backgroundImageColour={'primary'}
      backgroundUrl={theme?.images.graphicOverlayUrl}
    >
      <form className={styles.loginContainer}>
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
            />
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
          />
        </Button>

        <Divider dividerType="dashed" />

        {displayError && (
          <Alert
            className={'mt-5 mb-3'}
            message={'Password or ID incorrect. Please try again'}
            type={'error'}
          />
        )}
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
          disabled={!isValid || !isOnline}
          onClick={submitForm}
        >
          <Typography type="help" color="white" text={'Log in'} />
        </Button>
        {/* <Button
          id="gtm-signup"
          type="outlined"
          color={'primary'}
          disabled={!isOnline || isLoading}
          className={'mt-3 w-full'}
          onClick={() => history.push(ROUTES.SIGN_UP)}
        >
          <Typography type="help" color="primary" text={'Sign up'} />
        </Button> */}
      </form>
    </BannerWrapper>
  );
};
