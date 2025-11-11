import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';

import { useState } from 'react';
import { CreateUserForm } from './components/create-user-form/create-user-form';
import { useHistory, useLocation } from 'react-router';
import TransparentLayer from '../../assets/TransparentLayer.png';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { useTenant } from '@/hooks/useTenant';
import {
  createUser,
  CreateUserResult,
} from '@/utils/user/user-registration.utils';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';
import ROUTES from '@/routes/routes';
interface UserRegistrationProps {
  closeAction?: (item: boolean) => void;
}
export interface UserRegistrationRouteState {
  userId?: string;
  token?: string;
  shareInfoPartners?: boolean;
}

export const UserRegistration: React.FC<UserRegistrationProps> = ({
  closeAction,
}) => {
  const { isOnline } = useOnlineStatus();
  const { setNotification } = useNotifications();
  const tenant = useTenant();
  const history = useHistory();
  const { state } = useLocation<UserRegistrationRouteState>();
  const userId = state?.userId;
  const token = state?.token;
  const shareInfoPartners = state?.shareInfoPartners;
  const [messageError, setMessageError] = useState('');
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | undefined>(undefined);
  const [googleCredential, setGoogleCredential] = useState<string | undefined>(
    undefined
  );

  const onGoogleLoginSuccess = async (response: CredentialResponse) => {
    const credential = response.credential || '';
    const decoded = jwtDecode<any>(credential);
    const email = decoded.email;
    setGoogleEmail(email);
    setGoogleCredential(credential);
    // not working for open access yet - need to move the cell phone capture to the previous screen.
    if (tenant?.isWhiteLabel) {
      const createUserResult = await createUser({
        userId: userId as any as string,
        username: email,
        password: '',
        phoneNumber: '', // not needed
        registerType: 'google',
        shareInfoPartners,
        token,
        googleToken: credential,
        tenant,
      });
      switch (createUserResult) {
        case CreateUserResult.SuccessLogin:
          history.push(ROUTES.LOGIN);
          setMessageError('');
          setNotification({
            title: ` Successfully registered!`,
            variant: NOTIFICATION.SUCCESS,
          });
          break;
        case CreateUserResult.UsernameExists:
          setMessageError(
            `Username already exists! Try using your email address, phone number, or add a number/letter`
          );
          setNotification({
            title: ` Failed to check the username!`,
            variant: NOTIFICATION.ERROR,
          });
          break;
        case CreateUserResult.RegistrationFailed:
        default:
          setMessageError('');
          setNotification({
            title: `Registration failed. Please try again.`,
            variant: NOTIFICATION.ERROR,
          });
          break;
      }
    }
  };

  const onGoogleLoginError = () => {
    console.log('Google Login failed.');
  };

  return (
    <BannerWrapper
      size="small"
      onBack={() => history?.goBack()}
      color="primary"
      className={'h-screen'}
      backgroundUrl={TransparentLayer}
      displayOffline={!isOnline}
    >
      <div className="p-4">
        <Typography
          type={'h2'}
          text={'How would you like to sign up?'}
          className={'text-sm font-normal'}
          color={'textDark'}
        />
        {isOnline && !!process.env.REACT_APP_GOOGLE_CLIENT_ID && (
          <div className="mb-6 mt-6">
            <div className="mb-6 flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) =>
                  onGoogleLoginSuccess(credentialResponse)
                }
                onError={() => onGoogleLoginError()}
                type="standard"
                text="signup_with"
                logo_alignment="center"
                size="medium"
                width={300}
              />
            </div>
            {messageError && (
              <Typography
                type={'help'}
                text={messageError}
                className={'mt-1 mb-6 text-sm font-normal'}
                color={'errorMain'}
              />
            )}
            <Divider title="OR" />
          </div>
        )}
        <Button
          className={'mt-2 w-full rounded-xl'}
          type="filled"
          color="quatenary"
          onClick={() => setOpenCreateUser(true)}
          icon="UserCircleIcon"
          textColor="white"
          text="Create a username"
        ></Button>
      </div>
      <Dialog
        visible={openCreateUser}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <CreateUserForm
          closeAction={setOpenCreateUser}
          userId={userId}
          token={token}
          shareInfoPartners={shareInfoPartners}
          googleEmail={googleEmail}
          googleCredential={googleCredential}
        />
      </Dialog>
    </BannerWrapper>
  );
};
