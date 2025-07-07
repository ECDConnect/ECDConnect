import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';

import { useState } from 'react';
import { CreateUserForm } from './components/create-user-form/create-user-form';
import { useHistory, useLocation } from 'react-router';
import TransparentLayer from '../../assets/TransparentLayer.png';
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
  const history = useHistory();
  const { state } = useLocation<UserRegistrationRouteState>();
  const userId = state?.userId;
  const token = state?.token;
  const shareInfoPartners = state?.shareInfoPartners;
  const [openCreateUser, setOpencreateUser] = useState(false);

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
          shareInfoPartners={shareInfoPartners}
        />
      </Dialog>
    </BannerWrapper>
  );
};
