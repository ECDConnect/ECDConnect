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
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;
  const history = useHistory();
  const { state } = useLocation<UserRegistrationRouteState>();
  const userId = state?.userId;
  const token = state?.token;
  const shareInfoPartners = state?.shareInfoPartners;
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | undefined>(undefined);
  const [googleCredential, setGoogleCredential] = useState<string | undefined>(
    undefined
  );

  const onGoogleLoginSuccess = (response: CredentialResponse) => {
    const credential = response.credential || '';
    const decoded = jwtDecode<any>(credential);
    const email = decoded.email;
    setGoogleEmail(email);
    setGoogleCredential(credential);
    setOpenCreateUser(true);
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
        {isOpenAccess &&
          isOnline &&
          !!process.env.REACT_APP_GOOGLE_CLIENT_ID && (
            <div className="mb-6 mt-6">
              <div className="mb-6 flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) =>
                    onGoogleLoginSuccess(credentialResponse)
                  }
                  onError={() => onGoogleLoginError()}
                  type="standard"
                  text="signin_with"
                  logo_alignment="center"
                  size="medium"
                  width={300}
                />
              </div>
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
