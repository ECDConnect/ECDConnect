import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  Config,
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
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '@/store';
import { authThunkActions } from '@/store/auth';
import {
  generateSignupCellPhoneNumberToken,
  verifySignupCellPhoneNumberToken,
} from '@/utils/user/user-registration.utils';

interface VerifyPhoneNumberProps {
  closeAction: (verified: boolean) => void;
  phoneNumber: string;
  verifyToken: string;
}

export const VerifySignupPhoneNumberAuthCode: React.FC<
  VerifyPhoneNumberProps
> = ({ closeAction, phoneNumber, verifyToken }) => {
  const { isOnline } = useOnlineStatus();
  const { theme } = useTheme();
  const { setNotification } = useNotifications();
  const appDispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [userAuthCode, setUserAuthCode] = useState('');
  const userAuthCodeLength = userAuthCode?.length;
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState<string>(verifyToken);
  // Testing aid: populated only in non-production environments where the backend
  // has exposed auth codes for testing. Lets testers using throwaway numbers that
  // don't receive the SMS still complete verification.
  const [devAuthCode, setDevAuthCode] = useState<string>();

  const fetchDevAuthCode = useCallback(async () => {
    // Gated by a runtime settings flag so the request is never made in
    // production (where it is disabled), avoiding unnecessary traffic.
    if (!Config.exposeAuthCodesForTesting) return;
    try {
      const code = await appDispatch(
        authThunkActions.getLatestAuthCode({ phoneNumber })
      ).unwrap();
      setDevAuthCode(code || undefined);
    } catch {
      setDevAuthCode(undefined);
    }
  }, [appDispatch, phoneNumber]);

  useEffect(() => {
    fetchDevAuthCode();
  }, [fetchDevAuthCode]);

  const handleConfirmAuthCode = async () => {
    setIsLoading(true);
    const verified = await verifySignupCellPhoneNumberToken(
      phoneNumber,
      token,
      userAuthCode
    );
    if (verified) {
      setNotification({
        title: `Auth code confirmed`,
        variant: NOTIFICATION.SUCCESS,
      });
      closeAction?.(true);
    } else {
      setNotification({
        title: ` Failed to verify the auth token!`,
        variant: NOTIFICATION.ERROR,
      });
      setErrorMessage('Wrong code. Please insert a valid code!');
      setIsLoading(false);
    }
  };

  const resendOAAuthCode = async () => {
    const token = await generateSignupCellPhoneNumberToken(phoneNumber);
    if (token) {
      setToken(token);
      fetchDevAuthCode();
    } else {
      setErrorMessage('Unable to send a new code.');
    }
  };

  return (
    <BannerWrapper
      size="small"
      color="primary"
      className={'h-screen'}
      menuLogoUrl={theme?.images?.logoUrl}
      displayOffline={!isOnline}
      onBack={undefined}
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
        {devAuthCode && (
          <Alert
            className="mt-2 mb-2 rounded-md"
            title={`Testing only — code: ${devAuthCode}`}
            message="This code is shown for testing environments only and is never available in production."
            type="warning"
          />
        )}
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
              closeAction?.(false);
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
