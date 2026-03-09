import React from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router-dom';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { LogoutInformation } from './logout-information';
import ROUTES from '@/routes/routes';

export type LogoutModalProps = {
  onSubmit: () => void;
  onCancel?: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({ onSubmit, onCancel }) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { resetAppStore, resetAuth, resetUser } = useStoreSetup();

  const handleSync = async () => {
    if (isOnline) {
      await resetAppStore();
      await resetAuth();
      await resetUser();
      history.push('/');
    } else {
      history.push(ROUTES.LOGIN);
      onCancel?.();
    }
  };

  return (
    <LogoutInformation
      isOnline={isOnline}
      onSubmit={handleSync}
      onCancel={onCancel}
    ></LogoutInformation>
  );
};

export default LogoutModal;
