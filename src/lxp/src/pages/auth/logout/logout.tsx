import { ActionModal } from '@ecdlink/ui';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useHistory } from 'react-router-dom';
import ROUTES from '@/routes/routes';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useState } from 'react';

export type LogoutProps = {
  onSubmit?: () => void;
  onCancel?: () => void;
};

export const Logout: React.FC<LogoutProps> = ({ onSubmit, onCancel }) => {
  const { isOnline } = useOnlineStatus();
  const { resetAuth, resetAppStore, resetUser } = useStoreSetup();
  const history = useHistory();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // prevent double-click

    setIsLoggingOut(true);

    try {
      if (isOnline) {
        await resetAppStore();
        await resetAuth();
        await resetUser();
        history.push(ROUTES.LOGIN);
      } else {
        // Offline: just clear auth and go to login
        await resetAuth();
        await resetUser();
        history.push(ROUTES.LOGIN);
      }

      onSubmit?.();
    } catch (error) {
      console.error('Logout failed:', error);
      // Optional: show error toast/notification here
      // e.g. showToast({ title: 'Logout failed', variant: 'error' });
    } finally {
      setIsLoggingOut(false);
    }

    if (isOnline) {
      await resetAppStore();
      await resetAuth();
      await resetUser();
      history.push(ROUTES.LOGIN);
    } else {
      await resetAuth();
      await resetUser();
      history.push(ROUTES.LOGIN);
    }
  };

  return (
    <ActionModal
      className="mx-4"
      title="Are you sure you want to log out?"
      icon="ExclamationCircleIcon"
      iconColor="alertDark"
      iconBorderColor="alertBg"
      detailText={isLoggingOut ? 'Logging out...' : ''}
      actionButtons={[
        {
          text: isLoggingOut ? 'Logging out...' : 'Yes, log out',
          colour: 'quatenary',
          onClick: handleLogout,
          type: 'filled',
          textColour: 'white',
          leadingIcon: isLoggingOut ? undefined : 'CheckCircleIcon',
          disabled: isLoggingOut, // ← important!
        },
        {
          text: 'No, cancel',
          textColour: 'white',
          colour: 'quatenary',
          type: 'filled',
          onClick: () => onCancel?.(),
          leadingIcon: 'XCircleIcon',
          disabled: isLoggingOut, // disable cancel during logout
        },
      ]}
    />
  );
};
