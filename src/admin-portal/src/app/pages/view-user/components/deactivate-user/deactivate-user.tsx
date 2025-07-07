import { Button, DialogPosition } from '@ecdlink/ui';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import {
  NOTIFICATION,
  UserDto,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import { useMutation } from '@apollo/client';
import { DeleteUser } from '@ecdlink/graphql';
import { useCallback } from 'react';

interface DeactivateUserProps {
  userData: UserDto;
  refetchUserData?: () => void;
  isSuperAdmin?: boolean;
}

export const DeactivateUser: React.FC<DeactivateUserProps> = ({
  userData,
  refetchUserData,
  isSuperAdmin,
}) => {
  const dialog = useDialog();
  const { setNotification } = useNotifications();
  const [deactivateUser] = useMutation(DeleteUser);

  const handleDeactivateUser = useCallback(() => {
    deactivateUser({
      variables: {
        id: userData?.id,
      },
    })
      .then(() => {
        refetchUserData();
        setNotification({
          title: 'Successfully deactivate User!',
          variant: NOTIFICATION.SUCCESS,
        });
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to deactivate User!',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [deactivateUser, refetchUserData, setNotification, userData?.id]);

  const deactivaterUser = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title={`Are you sure you want to deactivate ${userData?.firstName}?`}
          message={`${userData?.firstName} will lose their access to the app immediately. Make sure you have communicated with them before deactivating them.`}
          btnText={['Yes, deactivate user', 'No, Cancel']}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            handleDeactivateUser();
          }}
        />
      ),
    });
  };

  return (
    <div>
      {isSuperAdmin && (
        <Button
          className={'w-full rounded-2xl lg:w-56'}
          type="outlined"
          color="tertiary"
          onClick={deactivaterUser}
          icon="TrashIcon"
          text="Deactivate user"
          textColor="tertiary"
        ></Button>
      )}
    </div>
  );
};
