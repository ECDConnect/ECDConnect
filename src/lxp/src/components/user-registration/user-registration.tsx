import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';

import { useEffect, useState } from 'react';
import { CreateUserForm } from './components/create-user-form/create-user-form';
import { useHistory, useLocation } from 'react-router';
import TransparentLayer from '../../assets/TransparentLayer.png';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { useTenant } from '@/hooks/useTenant';
import {
  createUser,
  CreateUserInfo,
  CreateUserResult,
} from '@/utils/user/user-registration.utils';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';
import ROUTES from '@/routes/routes';
import { Login as FacebookLogin } from 'react-facebook';
import { LoginResponse } from '@/types/facebook';

interface UserRegistrationProps {}
export interface UserRegistrationRouteState {
  userId?: string;
  token?: string;
  shareInfoPartners?: boolean;
  phoneNumber?: string;
}

export const UserRegistration: React.FC<UserRegistrationProps> = ({}) => {
  const { isOnline } = useOnlineStatus();
  const { setNotification } = useNotifications();
  const tenant = useTenant();
  const history = useHistory();
  const { state } = useLocation<UserRegistrationRouteState>();
  const userId = state?.userId;
  const token = state?.token;
  const shareInfoPartners = state?.shareInfoPartners;
  const phoneNumber = state?.phoneNumber;
  const [messageError, setMessageError] = useState('');
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | undefined>(undefined);
  const [googleCredential, setGoogleCredential] = useState<string | undefined>(
    undefined
  );

  const isSslEnabled = window.location.protocol === 'https:';

  const onLoginSuccess = async (createUserInfo: CreateUserInfo) => {
    const createUserResult = await createUser(createUserInfo);
    switch (createUserResult) {
      case CreateUserResult.UsernameExistsLogin:
      case CreateUserResult.SuccessLogin:
        history.push(ROUTES.LOGIN, {
          username: createUserInfo.username,
          password: '',
          loginType: createUserInfo.registerType,
          googleToken: createUserInfo.googleToken,
          facebookToken: createUserInfo.facebookToken,
        });
        setMessageError('');
        if (createUserResult === CreateUserResult.SuccessLogin) {
          setNotification({
            title: ` Successfully registered!`,
            variant: NOTIFICATION.SUCCESS,
          });
        }
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
  };

  const onGoogleLoginSuccess = async (response: CredentialResponse) => {
    const credential = response.credential || '';
    const decoded = jwtDecode<any>(credential);
    const email = decoded.email;
    setGoogleEmail(email);
    setGoogleCredential(credential);

    await onLoginSuccess({
      userId: userId as any as string,
      username: email,
      password: '',
      phoneNumber: phoneNumber ?? '',
      registerType: 'google',
      shareInfoPartners,
      token,
      googleToken: credential,
      facebookToken: undefined,
      tenant,
    });
  };

  const onGoogleLoginError = () => {
    console.log('Google Login failed.');
  };

  const onFacebookLoginSuccess = async (response: LoginResponse) => {
    const { userID, accessToken } = response.authResponse;

    await onLoginSuccess({
      userId: userId as any as string,
      username: userID,
      password: '',
      phoneNumber: phoneNumber ?? '',
      registerType: 'facebook',
      shareInfoPartners,
      token,
      googleToken: undefined,
      facebookToken: accessToken,
      tenant,
    });
  };

  const onFacebookLoginError = (error: Error) => {
    console.log('Facebook login failed', error);
  };

  useEffect(() => {
    if (
      (!!userId && !!token) ||
      (shareInfoPartners !== undefined && !!phoneNumber)
    ) {
      return;
    }
    history.push(ROUTES.ROOT);
  });

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
        {isOnline &&
          (!!process.env.REACT_APP_GOOGLE_CLIENT_ID ||
            (!!process.env.REACT_APP_FACEBOOK_APP_ID && isSslEnabled)) && (
            <div className="mb-6 mt-6">
              {!!process.env.REACT_APP_GOOGLE_CLIENT_ID && (
                <div className="mb-6 flex justify-center">
                  <GoogleLogin
                    onSuccess={(credentialResponse) =>
                      onGoogleLoginSuccess(credentialResponse)
                    }
                    onError={() => onGoogleLoginError()}
                    type="standard"
                    text="signup_with"
                    logo_alignment="center"
                    size="large"
                    width={250}
                  />
                </div>
              )}
              {!!process.env.REACT_APP_FACEBOOK_APP_ID && isSslEnabled && (
                <div className="mb-6 flex justify-center">
                  <FacebookLogin
                    onSuccess={(response: any) =>
                      onFacebookLoginSuccess(response)
                    }
                    onError={(error: Error) => onFacebookLoginError(error)}
                    fields={['id', 'name', 'picture']}
                    scope={['public_profile']}
                    //className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    className="flex h-10 items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                    </svg>
                    <span>Sign up with Facebook</span>
                  </FacebookLogin>
                </div>
              )}
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
          phoneNumber={phoneNumber}
        />
      </Dialog>
    </BannerWrapper>
  );
};
