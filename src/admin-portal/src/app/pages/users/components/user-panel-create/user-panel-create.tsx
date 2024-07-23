import { useApolloClient, useMutation } from '@apollo/client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  ActionModal,
  Alert,
  Button,
  Dialog,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { UserPanelCreateProps } from '../users';
import {
  NOTIFICATION,
  initialUserDetailsValues,
  useNotifications,
} from '@ecdlink/core';
import {
  AddUsersToRole,
  ApplicationUser,
  CreateUser,
  SendInviteToApplication,
  UserList,
  UserModelInput,
} from '@ecdlink/graphql';
import { newGuid } from '../../../../utils/uuid.utils';
import FormField from '../../../../components/form-field/form-field';
import { SaveIcon, XIcon } from '@heroicons/react/solid';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { ApplicationAdminRouteState } from '../../sub-pages/application-admins/applications-admins.types';

export const userSchema = yup.object().shape({
  firstName: yup.string().required('First name is Required'),
  surname: yup.string().required('Surname is Required'),
  email: yup.string().required('Email is Required').email('Invalid email'),
});

export default function UserPanelCreate(props: UserPanelCreateProps) {
  const [emailInUse, setEmailInUse] = useState<string>();

  const { setNotification } = useNotifications();

  const { state } = useLocation<ApplicationAdminRouteState>();

  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  const apolloClient = useApolloClient();

  const { users } =
    apolloClient.readQuery<{ users?: ApplicationUser[] }>({
      query: UserList,
      variables: state?.queryVariables,
    }) || {};

  const [sendInviteToApplication, { loading: sendInviteLoading }] = useMutation(
    SendInviteToApplication
  );
  const [createUser, { loading }] = useMutation(CreateUser);
  const [addRolesToUser] = useMutation(AddUsersToRole);

  // FORMS
  // USER FORM DETAILS
  const { register, formState, handleSubmit, watch } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);

  const { errors, isValid, isDirty } = formState;

  const email = watch('email');

  const isEmailInUse = !!emailInUse && emailInUse === email;

  const userMap = useMemo(
    () => new Map(users?.map((user) => [user?.email, user])),
    [users]
  );

  const emailExists = () => {
    const user = userMap.get(email);

    if (user) {
      setEmailInUse(user?.email);
      return user?.email;
    }
  };

  const onSave = async (formData: any) => {
    if (emailExists()) return;

    await saveUser(formData);
    emitCloseDialog(true);
  };

  const saveUser = async (formData: any) => {
    const userInputModel: UserModelInput = {
      id: newGuid(),
      firstName: formData.firstName,
      surname: formData.surname,
      email: formData.email,
      dateOfBirth: new Date(),
      isSouthAfricanCitizen: true,
      verifiedByHomeAffairs: true,
      isAdmin: true,
      contactPreference: 'email',
    };

    try {
      const response = await createUser({
        variables: {
          input: { ...userInputModel },
        },
      });

      setNotification({
        title: 'Successfully Created User!',
        variant: NOTIFICATION.SUCCESS,
      });

      const userId = response.data.addUser.id;
      await saveRoles(userId).then(async () => {
        await sendInviteToApplication({
          variables: {
            userId: userId,
            inviteToPortal: true,
          },
        })
          .then(() => {
            setNotification({
              title: 'Successfully Sent User an Invite!',
              variant: NOTIFICATION.SUCCESS,
            });
          })
          .catch(() => {
            setNotification({
              title: 'Failed to Send User an Invite!',
              variant: NOTIFICATION.ERROR,
            });
          });
      });
    } catch (err) {
      setNotification({
        title: `User ${formData.email} is already taken.`,
        variant: NOTIFICATION.ERROR,
      });
    }
  };

  const saveRoles = async (userId: string) => {
    const rolesToAdd: string[] = ['Administrator'];

    try {
      await addRolesToUser({
        variables: {
          userId: userId,
          roleNames: rolesToAdd,
        },
      });

      setNotification({
        title: 'Successfully Added roles to User!',
        variant: NOTIFICATION.SUCCESS,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getComponent = () => {
    return (
      <>
        <div className="">
          {isDirty && (
            <div className="focus:outline-none focus:ring-primary absolute right-5 -top-20 z-10 mt-6 flex h-7 items-center rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2">
              <button
                className="focus:outline-none focus:ring-primary rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2"
                onClick={() => setDisplayFormIsDirty(true)}
              >
                <span className="sr-only">Close panel</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          )}
          <div className="border-b border-dashed border-gray-500 px-2">
            <h1 className="py-4 text-xl font-medium leading-6 text-black">
              Administrator Details
            </h1>
            <p className="text-md pb-2 text-gray-500">Step 1 of 1</p>
          </div>
          <form className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-0">
              <div className="grid grid-cols-1 ">
                <div className="my-4 sm:col-span-3">
                  <FormField
                    label={'First name *'}
                    nameProp={'firstName'}
                    register={register}
                    error={errors.firstName?.message}
                    placeholder="First name"
                  />
                </div>
                <div className="my-4 sm:col-span-3">
                  <FormField
                    label={'Surname *'}
                    nameProp={'surname'}
                    register={register}
                    error={errors.surname?.message}
                    placeholder="Surname/family name"
                  />
                </div>
                <div className="my-4 sm:col-span-3">
                  <FormField
                    label={'Work email address *'}
                    nameProp={'email'}
                    register={register}
                    error={
                      isEmailInUse
                        ? 'A user already exists with this email.'
                        : errors.email?.message
                    }
                    placeholder="e.g name@email.com"
                  />
                </div>
              </div>
            </div>
          </form>
          <Dialog
            className={'mb-16 px-4'}
            stretch
            visible={displayFormIsDirty}
            position={DialogPosition.Middle}
          >
            <ActionModal
              icon={'InformationCircleIcon'}
              iconColor="alertMain"
              iconBorderColor="alertBg"
              importantText={`Discard unsaved changes?`}
              detailText={
                'If you leave now, you will lose all of your changes.'
              }
              actionButtons={[
                {
                  text: 'Keep editing',
                  textColour: 'secondary',
                  colour: 'secondary',
                  type: 'outlined',
                  onClick: () => setDisplayFormIsDirty(false),
                  leadingIcon: 'PencilIcon',
                },
                {
                  text: 'Discard changes',
                  textColour: 'white',
                  colour: 'secondary',
                  type: 'filled',
                  onClick: () => {
                    emitCloseDialog(false);
                  },
                  leadingIcon: 'TrashIcon',
                },
              ]}
            />
          </Dialog>
        </div>
      </>
    );
  };

  return (
    <article>
      <div className="mx-auto mt-5 max-w-5xl">{getComponent()}</div>
      {
        <Alert
          className="mt-2 mb-2 rounded-md"
          message={`An invitation will be sent to the new user when you click add.`}
          type="info"
        />
      }
      <Button
        className="mt-3 mr-6 w-full rounded"
        type="filled"
        color="secondary"
        disabled={!isValid || isEmailInUse}
        onClick={handleSubmit(onSave)}
        isLoading={loading || sendInviteLoading}
      >
        <SaveIcon color="white" className="mr-6 h-6 w-6" />
        <Typography type="help" color="white" text="Save"></Typography>
      </Button>
    </article>
  );
}
