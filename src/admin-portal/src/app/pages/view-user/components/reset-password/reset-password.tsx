import { Button, DialogPosition } from '@ecdlink/ui';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import {
  Config,
  HealthCareWorkerDto,
  NOTIFICATION,
  RoleSystemNameEnum,
  UserDto,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import { useMutation } from '@apollo/client';
import { SendInviteToApplication } from '@ecdlink/graphql';
import { useAuth } from '../../../../hooks/useAuth';
import { useState } from 'react';

interface ResetPasswordeProps {
  userData: UserDto;
}

export const ResetUserPassword: React.FC<ResetPasswordeProps> = ({
  userData,
}) => {
  const dialog = useDialog();
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const { setNotification } = useNotifications();

  const isAdminUser = userData?.roles?.some(
    (role: any) =>
      role.systemName === RoleSystemNameEnum.Administrator ||
      role.systemName === RoleSystemNameEnum.SuperAdmin ||
      role.systemName === RoleSystemNameEnum.TeamLead
  );

  const requestResetPasword = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Invite User"
          message={`You are about to send a reset password message to ${userData?.fullName}`}
          btnText={['Yes, Resend reset password', 'No, Cancel']}
          onCancel={onCancel}
          onSubmit={async () => {
            onSubmit();
            setIsLoading(true);
            const body = {
              email: userData?.email,
            };
            const isLinkSent = await forgotPassword(body, Config.authApi)
              .then(() => {
                setNotification({
                  title: 'Successfully Sent Reset Password!',
                  variant: NOTIFICATION.SUCCESS,
                });
              })
              .catch((err) => {
                setNotification({
                  title: 'Failed to Send Reset Password',
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
      className={'w-full rounded-2xl lg:w-52'}
      type="filled"
      // isLoading={isLoading}
      color="secondary"
      onClick={requestResetPasword}
      icon="PaperAirplaneIcon"
      text="Send passwor reset link"
      textColor="white"
    ></Button>
  );
};
