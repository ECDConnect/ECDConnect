import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
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
  CreateUser,
  SendInviteToApplication,
  UserModelInput,
} from '@ecdlink/graphql';
import { newGuid } from '../../../../utils/uuid.utils';
import FormField from '../../../../components/form-field/form-field';
import { SaveIcon } from '@heroicons/react/solid';

export const userSchema = yup.object().shape({
  firstName: yup.string().required('First name is Required'),
  surname: yup.string().required('Surname is Required'),
  email: yup.string().email('Invalid email'),
});

export default function UserPanelCreate(props: UserPanelCreateProps) {
  const { setNotification } = useNotifications();
  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  const [sendInviteToApplication,] = useMutation(SendInviteToApplication);
  const [createUser, { error }] = useMutation(CreateUser);
  const [addRolesToUser] = useMutation(AddUsersToRole);

  // FORMS
  // USER FORM DETAILS
  const { register, formState, getValues, handleSubmit, setValue } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });

  const { errors, isValid } = formState;

  const onSave = async (formData: any) => {
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
    };

    try {
      const response = await createUser({
        variables: {
          input: { ...userInputModel },
          IsAdmin: true,
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
            inviteToPortal: false,
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
        title: `Failed: ${error?.message}`,
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
        <div className=" border-b border-dashed border-gray-200 px-4 py-5">
        <div className="pb-2">
          <h1 className="text-uiMidDark text-xl font-medium leading-6">
            Create Administrator
          </h1>
        </div>

        <div className=" border-t border-dashed border-gray-500 px-4 py-5 "></div>

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
                    error={errors.email?.message}
                    placeholder="e.g name@email.com"
                  />
                </div>
              </div>
            </div>
          </form>
          <div></div>
        </div>
      </>
    );
  };

  return (
    <article>
      <div className="mx-auto mt-5 max-w-5xl">{getComponent()}</div>
      <Button
        className="mt-3 mr-6 w-full rounded"
        type="filled"
        color="secondary"
        disabled={!isValid}
        onClick={handleSubmit(onSave)}
      >
        <SaveIcon color="white" className="mr-6 h-6 w-6" />
        <Typography type="help" color="white" text="Save"></Typography>
      </Button>
    </article>
  );
}
