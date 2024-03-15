import { Button, DialogPosition } from '@ecdlink/ui';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import {
  HealthCareWorkerDto,
  NOTIFICATION,
  UserDto,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import { useMutation } from '@apollo/client';
import {
  DeactivateHealthCareWorker,
  DeactivateTeamLead,
} from '@ecdlink/graphql';
import { useCallback } from 'react';
import { GrowGreatRoles } from '../../../../utils/constants';
import { useHistory } from 'react-router';

interface DeactivateUserProps {
  userData: UserDto;
  chwData: HealthCareWorkerDto;
  refetchUserData?: () => void;
  isTeamLead?: boolean;
  teamLeadId?: string;
  hcwId?: string;
}

export const DeactivateUser: React.FC<DeactivateUserProps> = ({
  userData,
  chwData,
  refetchUserData,
  isTeamLead,
  teamLeadId,
  hcwId,
}) => {
  const dialog = useDialog();
  const { setNotification } = useNotifications();
  const [deactivateTeamLead] = useMutation(DeactivateTeamLead);
  const [deactivateHcw] = useMutation(DeactivateHealthCareWorker);
  const history = useHistory();

  const handleDeactivateUser = useCallback(() => {
    if (isTeamLead) {
      deactivateTeamLead({
        variables: {
          teamLeadId: teamLeadId,
        },
      })
        .then(() => {
          refetchUserData();
          setNotification({
            title: 'Successfully to deactivate Team Lead!',
            variant: NOTIFICATION.SUCCESS,
          });
        })
        .catch((err) => {
          setNotification({
            title: 'Failed to deactivate Team Lead',
            variant: NOTIFICATION.ERROR,
          });
        });
      history.push(`/users/team-leads`);
    } else {
      deactivateHcw({
        variables: {
          hcwId: hcwId,
        },
      })
        .then(() => {
          refetchUserData();
          setNotification({
            title: 'Successfully deactivate Health Care Worker!',
            variant: NOTIFICATION.SUCCESS,
          });
        })
        .catch((err) => {
          setNotification({
            title: 'Failed to deactivate Health Care Worker!',
            variant: NOTIFICATION.ERROR,
          });
        });
      history.push(`/users/health-care-worker`);
    }
  }, [
    chwData?.user.id,
    deactivateHcw,
    deactivateTeamLead,
    history,
    isTeamLead,
    refetchUserData,
    setNotification,
    userData?.id,
  ]);

  const deactivaterUser = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title={`Deactivate ${
            isTeamLead
              ? GrowGreatRoles?.TeamLead
              : GrowGreatRoles?.HealthCareWorker
          }`}
          message={`You are about to deactivate ${
            chwData?.user?.fullName ?? userData?.fullName
          }`}
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
        className={'mt-3 w-full rounded-2xl p-16'}
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
