import { ActionModal, Button, DialogPosition } from '@ecdlink/ui';
import {
  NOTIFICATION,
  UserDto,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import { useMutation, useQuery } from '@apollo/client';
import {
  GetLatestUrlInviteForUser,
  SendInviteToApplication,
} from '@ecdlink/graphql';

interface SendInviteProps {
  userData: UserDto;
  refetchUserData?: () => void;
  isFromAdministratorTable?: boolean;
}

export const SendInvite: React.FC<SendInviteProps> = ({
  userData,
  refetchUserData,
  isFromAdministratorTable,
}) => {
  const dialog = useDialog();
  const [sendInviteToApplication, { loading }] = useMutation(
    SendInviteToApplication
  );
  const { data: lastUrlInviteForuser } = useQuery(GetLatestUrlInviteForUser, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: userData?.id,
    },
  });

  const { setNotification } = useNotifications();

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
              disabled: !lastUrlInviteForuser,
              onClick: () => {
                navigator?.clipboard?.writeText &&
                  navigator?.clipboard?.writeText(
                    lastUrlInviteForuser?.latestUrlInviteForUser
                  );
                onCancel();
              },
            },
          ]}
        />
      ),
    });
  };

  const handleSendAdminInvite = () => {
    sendInviteToApplication({
      variables: {
        userId: userData?.id,
        inviteToPortal: isFromAdministratorTable,
      },
    }).then(() => {
      setNotification({
        title: 'Successfully Sent User Invite!',
        variant: NOTIFICATION.SUCCESS,
      });
    });
  };

  const handleSendNotificationByRole = () => {
    if (isFromAdministratorTable) {
      handleSendAdminInvite();
    } else {
      sendInvite();
    }
  };

  return (
    <Button
      className={'w-full rounded-2xl lg:w-52'}
      type="filled"
      isLoading={isFromAdministratorTable ? loading : false}
      disabled={isFromAdministratorTable ? loading : false}
      color="secondary"
      onClick={handleSendNotificationByRole}
      icon="PaperAirplaneIcon"
      text="Resend Invitation"
      textColor="white"
    ></Button>
  );
};
