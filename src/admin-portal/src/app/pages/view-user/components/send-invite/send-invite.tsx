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
import { SendInviteToApplication } from '@ecdlink/graphql';

interface SendInviteProps {
  userData: UserDto;
  chwData: HealthCareWorkerDto;
  refetchUserData?: () => void;
}

export const SendInvite: React.FC<SendInviteProps> = ({
  userData,
  chwData,
  refetchUserData,
}) => {
  const dialog = useDialog();
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const { setNotification } = useNotifications();

  const isAdminUser = userData?.roles?.some(
    (role: any) => role.name === 'Administrator' || role.name === 'Super Admin'
  );

  const sendInvite = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Invite User"
          message={`You are about to send an invite to ${
            chwData?.user?.fullName ?? userData?.fullName
          }`}
          btnText={['Yes, Resend Invitation', 'No, Cancel']}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            sendInviteToApplication({
              variables: {
                userId: userData?.id ?? chwData?.user.id,
                inviteToPortal: isAdminUser,
              },
            })
              .then(() => {
                refetchUserData();
                setNotification({
                  title: 'Successfully Sent Invite!',
                  variant: NOTIFICATION.SUCCESS,
                });
              })
              .catch((err) => {
                setNotification({
                  title: 'Failed to Send Invite!',
                  variant: NOTIFICATION.ERROR,
                });
              });
          }}
        />
      ),
    });
  };

  return (
    <Button
      className={'mt-3 w-4/12 rounded-2xl'}
      type="filled"
      // isLoading={isLoading}
      color="secondary"
      onClick={sendInvite}
      icon="PaperAirplaneIcon"
      text="Resend Invitation"
      textColor="white"
    ></Button>
  );
};
