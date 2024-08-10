import { ActionModal, Button, DialogPosition } from '@ecdlink/ui';
import {
  NOTIFICATION,
  RoleSystemNameEnum,
  UserDto,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import { useMutation } from '@apollo/client';
import { SendInviteToApplication } from '@ecdlink/graphql';

interface SendInviteProps {
  userData: UserDto;
  refetchUserData?: () => void;
}

export const SendInvite: React.FC<SendInviteProps> = ({
  userData,
  refetchUserData,
}) => {
  const dialog = useDialog();
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const { setNotification } = useNotifications();

  const isAdminUser = userData?.roles?.some(
    (role: any) =>
      role.systemName === RoleSystemNameEnum.Administrator ||
      role.systemName === RoleSystemNameEnum.SuperAdmin ||
      role.systemName === RoleSystemNameEnum.TeamLead
  );

  const sendInvite = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <ActionModal
          className="z-50"
          icon="ExclamationCircleIcon"
          iconColor="infoMain"
          iconClassName="h-10 w-10 bg-infoMain"
          title="Would you like to re-send the SMS or copy the URL?"
          buttonClass="rounded-2xl"
          detailText="You can re-send the SMS or, if the user is struggling to receive the SMS, you can copy the invite URL and paste it into a message to the user."
          actionButtons={[
            {
              colour: 'secondary',
              text: 'Re-send the SMS',
              textColour: 'white',
              type: 'filled',
              leadingIcon: 'PaperAirplaneIcon',
              onClick: () => {
                sendInviteToApplication({
                  variables: {
                    userId: userData?.id,
                    inviteToPortal: false,
                  },
                }).then(() => {
                  setNotification({
                    title: 'Successfully Sent User Invite!',
                    variant: NOTIFICATION.SUCCESS,
                  });
                });
                onSubmit();
              },
            },
            {
              colour: 'secondary',
              text: 'Copy the invite URL',
              textColour: 'secondary',
              type: 'outlined',
              leadingIcon: 'DuplicateIcon',
              onClick: onCancel,
            },
          ]}
        />

        // <AlertModal
        //   title="Would you like to re-send the SMS or copy the URL?"
        //   message={`You are about to send an invite to ${
        //     chwData?.user?.fullName ?? userData?.fullName
        //   }`}
        //   btnText={['Re-send the SMS', 'Copy the invite URL']}
        //   onCancel={onCancel}

        //   onSubmit={() => {
        //     onSubmit();
        //     sendInviteToApplication({
        //       variables: {
        //         userId: userData?.id ?? chwData?.user.id,
        //         inviteToPortal: isAdminUser,
        //       },
        //     })
        //       .then(() => {
        //         refetchUserData();
        //         setNotification({
        //           title: 'Successfully Sent Invite!',
        //           variant: NOTIFICATION.SUCCESS,
        //         });
        //       })
        //       .catch((err) => {
        //         setNotification({
        //           title: 'Failed to Send Invite!',
        //           variant: NOTIFICATION.ERROR,
        //         });
        //       });
        //   }}
        // />
      ),
    });
  };

  return (
    <Button
      className={'w-full rounded-2xl lg:w-52'}
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
