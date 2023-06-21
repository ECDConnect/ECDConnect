import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  AddUsersToRole,
  CreateUser,
  RoleList,
  SendInviteToApplication,
  UserModelInput,
} from '@ecdlink/graphql';
import { newGuid } from '../../../../utils/uuid.utils';

import UserDetailsForm from '../user-details-form/user-details-form';
import { UserPanelCreateProps } from '../users';
import { Alert, Button, Typography } from '@ecdlink/ui';
import { SaveIcon } from '@heroicons/react/solid';
import FormField from '../../../../components/form-field/form-field';
import { NOTIFICATION, RoleDto, useNotifications } from '@ecdlink/core';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  surname: yup.string().required('Surname is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
});

export default function UserPanelCreate(props: UserPanelCreateProps) {
  const [selectedUserRoles, setUserRoles] = useState<RoleDto[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleDto[]>([]);
  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      email: '',
    },
    mode: 'onChange'
  });
  const { errors, isValid } = formState;

  const { setNotification } = useNotifications();

  const { data: roleData } = useQuery(RoleList, {
    fetchPolicy: 'cache-and-network',
  });
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
  const [createUser] = useMutation(CreateUser);
  const [addRolesToUser] = useMutation(AddUsersToRole);

  useEffect(() => {
    if (roleData && roleData.roles) {
      const tempRoles = roleData.roles.filter(
        (x: RoleDto) =>
          !['Practitioner', 'Coach', 'Child', 'Principal', 'Franchisor'].includes(x.name)
      );

      setFilteredRoles(tempRoles);
    }
  }, [roleData]);

  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

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
      // await sendInviteToApplication({
      //   variables: {
      //     userId: userId,
      //   },
      // }).then(()=>{
      //   setNotification({
      //     title: 'Successfully Sent User an Invite!',
      //     variant: NOTIFICATION.SUCCESS,
      //   });
      // });

      await saveRoles(userId);
    } catch (error) {
      console.log(error);
    }
  };

  const saveRoles = async (userId: string) => {
    const rolesToAdd: string[] = ['Administrator'];
    selectedUserRoles.forEach((x) => {
      rolesToAdd.push(x.name);
    });

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
        <div className="rounded-lg px-4 py-0">
          <div className="border-b border-dashed pb-4">
            <h1 className="py-4 text-2xl text-black">Administrator details</h1>
            <label className="text-md block font-medium text-gray-700">
              Step 1 of 1
            </label>
          </div>
          <form
            key={`${new Date()}`}
            className="space-y-8 divide-y divide-gray-200"
            onSubmit={handleSubmit(onSave)}
          >
            <div className="space-y-0">
              <div className="grid grid-cols-1">
                <div className="my-4 sm:col-span-3">
                  <FormField
                    label="First name *"
                    nameProp="firstName"
                    register={register}
                    error={errors.firstName?.message}
                    placeholder="First name"
                  />
                </div>
                <div className="my-4 sm:col-span-3">
                  <FormField
                    label="Surname *"
                    nameProp="surname"
                    register={register}
                    error={errors.surname?.message}
                    placeholder="Surname/family name"
                  />
                </div>
                <div className="my-4 sm:col-span-3">
                  <FormField
                    label="Work email address *"
                    nameProp="email"
                    register={register}
                    error={errors.email?.message}
                    placeholder="e.g name@email.com"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-0 rounded-lg  px-4 py-0">
          <Alert
            className="mt-5 mb-3"
            message="An invitation will be sent to the new user when you click add."
            type="info"
          />
          <Button
            className="mt-3 rounded mr-6 w-full"
            type="filled"
            color="secondary"
            disabled={!isValid}
            onClick={handleSubmit(onSave)}
          >
            <SaveIcon color="white" className="w-6 h-6 mr-6" />
            <Typography
              type="help"
              color="white"
              text="Send Invitation"
            ></Typography>
          </Button>
        </div>
      </>
    );
  };

  return (
    <article>
      <div className="mx-auto mt-5 max-w-5xl">{getComponent()}</div>
    </article>
  );
}
