import { Button, DialogPosition } from '@ecdlink/ui';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import {
  NOTIFICATION,
  RoleDefaultNameEnum,
  UserDto,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import { useMutation } from '@apollo/client';
import {
  DeactivateHealthCareWorker,
  DeactivateTeamLead,
  DeleteUser,
} from '@ecdlink/graphql';
import { useCallback } from 'react';
import { useHistory } from 'react-router';

interface DeactivateUserProps {
  userData: UserDto;
  refetchUserData?: () => void;
  isTeamLead?: boolean;
  isAdministrator?: boolean;
  teamLeadId?: string;
  hcwId?: string;
}

export const DeactivateUser: React.FC<DeactivateUserProps> = ({
  userData,
  refetchUserData,
  isTeamLead,
  teamLeadId,
  hcwId,
  isAdministrator,
}) => {
  const dialog = useDialog();
  const { setNotification } = useNotifications();
  const [deactivateHcw] = useMutation(DeleteUser);

  const handleDeactivateUser = useCallback(() => {
    deactivateHcw({
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
  }, [deactivateHcw, refetchUserData, setNotification, userData?.id]);

  const deactivaterUser = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title={`Deactivate ${
            isAdministrator
              ? RoleDefaultNameEnum.Administrator
              : isTeamLead
              ? RoleDefaultNameEnum.TeamLead
              : RoleDefaultNameEnum.CHW
          }`}
          message={`You are about to deactivate ${userData?.fullName}`}
          btnText={['Yes, deactivate', 'No, Cancel']}
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
      <Button
        className={'w-full rounded-2xl lg:w-56'}
        type="outlined"
        // isLoading={isLoading}
        color="tertiary"
        onClick={deactivaterUser}
        icon="TrashIcon"
        text="Deactivate user"
        textColor="tertiary"
      ></Button>
    </div>
  );
};
