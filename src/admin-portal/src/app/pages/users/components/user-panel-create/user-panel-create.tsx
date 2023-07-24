import { useMutation } from '@apollo/client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert, Button, Typography } from '@ecdlink/ui';
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

  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const [createUser, { loading }] = useMutation(CreateUser);
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
        disabled={!isValid}
        onClick={handleSubmit(onSave)}
        isLoading={loading}
      >
        <SaveIcon color="white" className="mr-6 h-6 w-6" />
        <Typography type="help" color="white" text="Save"></Typography>
      </Button>
    </article>
  );
}
