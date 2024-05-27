import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import ROUTES from '@/routes/routes';
import { AuthService } from '@/services/AuthService';
import {
  AuthCodeModel,
  Config,
  NOTIFICATION,
  ResendAuthCodeModel,
  useNotifications,
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

interface VerifyPhoneNumberProps {
  closeAction?: (item: boolean) => void;
  userId?: string;
  phoneNumber: string;
  username: string;
}

export const VerifyPhoneNumber: React.FC<VerifyPhoneNumberProps> = ({
  closeAction,
  phoneNumber,
  username,
}) => {
  const { isOnline } = useOnlineStatus();
  const { setNotification } = useNotifications();
  const history = useHistory();
  const tenant = useTenant();
  const orgName = tenant?.tenant?.organisationName;
  const [isLoading, setIsLoading] = useState(false);
  const [userAuthCode, setUserAuthCode] = useState('');
  const userAuthCodeLength = userAuthCode?.length;
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirmAuthCode = async () => {
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
        setErrorMessage('Wrong code. Please insert a valid code!');
        setIsLoading(false);
        return;
      });

    if (confirmAuthToken) {
      setNotification({
        title: `Auth code confirmed`,
        variant: NOTIFICATION.SUCCESS,
      });
      history.push(ROUTES.LOGIN);
    }
  };

  const resendOAAuthCode = async () => {
    const body: ResendAuthCodeModel = {
      username,
    };
    const resendAuthCode = await new AuthService().SendOAAuthCode(body);
  };

  return (
    <BannerWrapper
      size="small"
      onBack={() => closeAction && closeAction(false)}
      color="primary"
      className={'h-screen'}
      title={orgName}
      displayOffline={!isOnline}
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
            onClick={() => {}}
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
