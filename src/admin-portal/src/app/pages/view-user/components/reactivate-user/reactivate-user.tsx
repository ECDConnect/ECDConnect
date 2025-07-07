import { ActionModal, Button, DialogPosition } from '@ecdlink/ui';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';
import {
  NOTIFICATION,
  RoleDefaultNameEnum,
  UserDto,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import { useMutation } from '@apollo/client';
import { ReactivateMultipleUsers } from '@ecdlink/graphql';
import { useCallback } from 'react';
import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
// import { ReactivateMultipleUsers } from '@ecdlink/graphql/lib/graphql/users';

interface ReactivateUserProps {
  userData: UserDto;
  refetchUserData?: () => void;
  isAdministrator?: boolean;
}

export const ReactivateUser: React.FC<ReactivateUserProps> = ({
  userData,
  refetchUserData,
}) => {
  const dialog = useDialog();
  const { setNotification } = useNotifications();
  const [reactivateMultipleUser] = useMutation(ReactivateMultipleUsers);

  const handleReactivateUser = useCallback(() => {
    reactivateMultipleUser({
      variables: {
        userIds: [userData?.id],
      },
    })
      .then(() => {
        refetchUserData && refetchUserData();
        setNotification({
          title: userData.firstName + ' has been reactivated!',
          variant: NOTIFICATION.SUCCESS,
        });
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to reactivate User',
          variant: NOTIFICATION.ERROR,
        });
      });
  }, [
    reactivateMultipleUser,
    refetchUserData,
    setNotification,
    userData.firstName,
    userData?.id,
  ]);

  const reactivaterUser = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <ActionModal
          className="z-80"
          customIcon={
            <ExclamationCircleIcon className="text-alertMain mb-4 h-12 w-12" />
          }
          importantText={`Are you sure you want to reactivate this user?`}
          actionButtons={[
            {
              text: 'Yes, reactivate',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => {
                onSubmit();
                handleReactivateUser();
              },
              leadingIcon: 'PencilIcon',
            },
            {
              text: 'No, Cancel',
              textColour: 'white',
              colour: 'secondary',
              type: 'filled',
              onClick: () => onCancel(),
              leadingIcon: 'XIcon',
            },
          ]}
          buttonClass="rounded-2xl"
        />
      ),
    });
  };

  return (
    <div>
      <Button
        className={'w-full rounded-2xl lg:w-56'}
        type="filled"
        // isLoading={isLoading}
        color="secondary"
        onClick={reactivaterUser}
        icon="KeyIcon"
        text="Reactivate user"
        textColor="white"
      ></Button>
    </div>
  );
};
