import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import ROUTES from '@/routes/routes';
import { AuthService } from '@/services/AuthService';
import { useAppDispatch } from '@/store';
import { authActions, authThunkActions } from '@/store/auth';
import { settingActions } from '@/store/settings';
import { userThunkActions } from '@/store/user';
import {
  AuthCodeModel,
  Config,
  LoginRequestModel,
  NOTIFICATION,
  useNotifications,
  useTheme,
} from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useHistory } from 'react-router';
import ReactGA from 'react-ga4';
const { version } = require('../../../../package.json');

interface VerifyPhoneNumberProps {
  closeAction?: (item: boolean) => void;
  phoneNumber?: string;
  username: string;
  setIsFromAuthCodeScreen?: (item: boolean) => void;
  password?: string;
  handleChangePhoneNumber?: () => void;
  saveNewPractitionerUserData?: () => void;
  isFromEditCellPhone?: boolean;
  setEditiCellPhoneNumber?: (item: boolean) => void;
}

export const VerifyPhoneNumberAuthCode: React.FC<VerifyPhoneNumberProps> = ({
  closeAction,
  phoneNumber,
  username,
  setIsFromAuthCodeScreen,
  password,
  handleChangePhoneNumber,
  saveNewPractitionerUserData,
  isFromEditCellPhone,
  setEditiCellPhoneNumber,
}) => {
  const { isOnline } = useOnlineStatus();
  const { theme } = useTheme();
  const appDispatch = useAppDispatch();
  const { setNotification } = useNotifications();
  const history = useHistory();
  const tenant = useTenant();
  const orgName = tenant?.tenant?.organisationName;
  const [isLoading, setIsLoading] = useState(false);
  const [userAuthCode, setUserAuthCode] = useState('');
  const userAuthCodeLength = userAuthCode?.length;
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleConfirmAuthCode = async () => {
    setIsLoading(true);
    const body: AuthCodeModel = {
      username,
      token: String(userAuthCode),
    };

    const confirmAuthToken = await new AuthService()
      ?.VerifyAuthCode(Config.authApi, body)
      .catch((error) => {
        setNotification({
          title: ` Failed to verify the auth token!`,
          variant: NOTIFICATION.ERROR,
        });
        if (isFromEditCellPhone) {
          saveNewPractitionerUserData && saveNewPractitionerUserData();
        }
        setErrorMessage('Wrong code. Please insert a valid code!');
        setIsLoading(false);
        return;
      });

    if (confirmAuthToken && isFromEditCellPhone) {
      saveNewPractitionerUserData && (await saveNewPractitionerUserData());
      closeAction && closeAction(false);
      setEditiCellPhoneNumber && setEditiCellPhoneNumber(false);
    }

    if (confirmAuthToken && password) {
      setNotification({
        title: `Auth code confirmed`,
        variant: NOTIFICATION.SUCCESS,
      });
      const body: LoginRequestModel = {
        username,
        password,
      };

      appDispatch(authThunkActions.login(body))
        .then(async (isAuthenticated: any) => {
          if (
            isAuthenticated &&
            isAuthenticated?.error === undefined &&
            isAuthenticated?.payload?.response?.status !== 401
          ) {
            login();
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  const resendOAAuthCode = async () => {
    const resendAuthCode = await new AuthService().SendOAAuthCode(
      username,
      phoneNumber!
    );
  };

  const handleGoBack = () => {
    isFromEditCellPhone && closeAction && closeAction(false);
    setEditiCellPhoneNumber && setEditiCellPhoneNumber(false);
  };

  return (
    <BannerWrapper
      size="small"
      color="primary"
      className={'h-screen'}
      menuLogoUrl={theme?.images?.logoUrl}
      displayOffline={!isOnline}
      onBack={
        isFromEditCellPhone && closeAction ? () => handleGoBack() : undefined
      }
    >
      <div className="p-4">
        <Typography
          type={'h2'}
          text={'Enter your 6 digit code'}
          className={'text-sm font-normal'}
          color={'textDark'}
        />
        <Alert
          className="mt-2 mb-2 rounded-md"
          message={`We've sent an SMS with a 6 digit code to ${phoneNumber}.`}
          type="info"
        />
        <FormInput
          label="Enter your 6 digit code"
          placeholder="------"
          className="mt-10"
          value={userAuthCode}
          type="number"
          onChange={(event) => {
            setUserAuthCode(event.target.value?.slice(0, 6));
            setErrorMessage('');
          }}
        />
        {errorMessage && (
          <Typography
            type={'help'}
            text={errorMessage}
            className={'text-sm font-normal'}
            color={'errorDark'}
          />
        )}
        {userAuthCodeLength === 6 ? (
          <div>
            <Button
              className={'mt-3 w-full rounded-2xl'}
              type="filled"
              isLoading={isLoading}
              color="quatenary"
              disabled={!userAuthCode}
              onClick={handleConfirmAuthCode}
            >
              {renderIcon('CheckCircleIcon', 'h-6 w-6 text-white mr-2')}
              <Typography
                type="help"
                color="white"
                text={'Confirm'}
              ></Typography>
            </Button>
          </div>
        ) : (
          <div>
            <Button
              className={'mt-3 w-full rounded-2xl'}
              type="filled"
              isLoading={isLoading}
              color="quatenary"
              onClick={resendOAAuthCode}
            >
              <Typography
                type="help"
                color="white"
                text={'Send me a new code'}
              ></Typography>
            </Button>
          </div>
        )}
        <div className={'mt-6 flex flex-1 flex-row items-center justify-start'}>
          {renderIcon('QuestionMarkCircleIcon', 'h-5 w-5 text-secondary mr-2')}
          <Typography
            type="unspecified"
            fontSize="14"
            className="mr-2"
            color="textDark"
            text={`Didn't receive the code?`}
          ></Typography>
          <Button
            type="filled"
            color="secondaryAccent2"
            background="transparent"
            size="small"
            onClick={() => {
              setIsFromAuthCodeScreen && setIsFromAuthCodeScreen(true);
              closeAction && closeAction(false);
            }}
          >
            <Typography
              type="help"
              color="secondary"
              text={'Change number'}
            ></Typography>
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};
