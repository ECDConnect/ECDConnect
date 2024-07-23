import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import facebookLogo from '../../assets/icon/facebook_white.svg';
import { useState } from 'react';
import { CreateUserForm } from './components/create-user-form/create-user-form';
import { useTenant } from '@/hooks/useTenant';
import { useHistory, useLocation } from 'react-router';
import { useTheme } from '@ecdlink/core';

interface UserRegistrationProps {
  closeAction?: (item: boolean) => void;
}

export interface UserRegistrationRouteState {
  userId?: string;
  token?: string;
}

export const UserRegistration: React.FC<UserRegistrationProps> = ({
  closeAction,
}) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { state } = useLocation<UserRegistrationRouteState>();
  const userId = state?.userId;
  const token = state?.token;
  const [openCreateUser, setOpencreateUser] = useState(false);
  const { theme } = useTheme();

  return (
    <BannerWrapper
      size="small"
      onBack={() => history?.goBack()}
      color="primary"
      className={'h-screen'}
      backgroundUrl={theme?.images.graphicOverlayUrl}
      displayOffline={!isOnline}
    >
      <div className="p-4">
        <Typography
          type={'h2'}
          text={'How would you like to sign up?'}
          className={'text-sm font-normal'}
          color={'textDark'}
        />
        <div>
          <Button
            className={'mt-10 w-full rounded-xl'}
            type="filled"
            color="infoMain"
            onClick={() => {}}
            textColor="white"
          >
            <img
              src={facebookLogo}
              alt="facebook"
              className="relative mr-2 h-5 w-5"
            />
            <Typography
              type={'h4'}
              text={'Sign up with Facebook'}
              className={'text-sm font-normal'}
              color={'white'}
            />
          </Button>
        </div>
        <div className="my-12 flex flex-row items-center gap-2">
          <Divider className="absolute w-6/12" />
          <Typography
            type={'h4'}
            text={'OR'}
            className={'text-sm font-normal'}
            color={'textMid'}
          />
          <Divider className="absolute w-6/12" />
        </div>
        <Button
          className={'mt-2 w-full rounded-xl'}
          type="filled"
          color="quatenary"
          onClick={() => setOpencreateUser(true)}
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
          closeAction={setOpencreateUser}
          userId={userId}
          token={token}
        />
      </Dialog>
    </BannerWrapper>
  );
};
