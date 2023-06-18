import { useMutation, useQuery } from '@apollo/client';
import {
  initialPasswordValue,
  initialUserDetailsValues,
  NOTIFICATION,
  passwordSchema,
  RoleDto,
  useNotifications,
  userSchema,
} from '@ecdlink/core';
import {
  AddUsersToRole,
  CreateUser,
  RoleList,
  UserModelInput,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newGuid } from '../../../../utils/uuid.utils';
import UserDetailsForm from '../user-details-form/user-details-form';
import { UserPanelCreateProps } from '../users';
import { PaperAirplaneIcon, PlusIcon } from '@heroicons/react/solid';
import { Alert, Button, Typography } from '@ecdlink/ui';

export default function UserPanelCreate(props: UserPanelCreateProps) {
  const { setNotification } = useNotifications();
  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  const { data: roleData } = useQuery(RoleList, {
    fetchPolicy: 'cache-and-network',
  });

  const [createUser] = useMutation(CreateUser);
  const [addRolesToUser] = useMutation(AddUsersToRole);

  const [selectedUserRoles, setUserRoles] = useState<RoleDto[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleDto[]>([]);

  useEffect(() => {
    if (roleData && roleData.roles) {
      const tempRoles = roleData.roles.filter(
        (x: RoleDto) =>
          x.name !== 'Practitioner' &&
          x.name !== 'Coach' &&
          x.name !== 'Child' &&
          x.name !== 'Principal' &&
          x.name !== 'Franchisor'
      );

      setFilteredRoles(tempRoles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleData]);

  const {
    register: userDetailRegister,
    setValue: userDetailSetValue,
    formState: userDetailFormState,
    getValues: userDetailGetValues,
    control,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onBlur',
  });
  const { errors: userDetailFormErrors, isValid: isUserDetailValid } =
    userDetailFormState;

  const onSave = async () => {
    await saveUser();
    emitCloseDialog(true);
  };

  console.log(">", selectedUserRoles)

  const saveUser = async () => {
    const userDetailForm = userDetailGetValues();
    const userInputModel: UserModelInput = {
      id: newGuid(),
      firstName: userDetailForm.firstName,
      surname: userDetailForm.surname,
      email: userDetailForm.email,
      isSouthAfricanCitizen: false,
      idNumber: null,
      verifiedByHomeAffairs: false,
      dateOfBirth: new Date(),
      genderId: null,
      contactPreference: null,
      phoneNumber: null
    };

    await createUser({
      variables: {
        input: { ...userInputModel },
        createAdmin: true,
      },
    })
      .then(async (response) => {
        setNotification({
          title: 'Successfully Created User!',
          variant: NOTIFICATION.SUCCESS,
        });

        const userId = response.data.addUser.id;
        await saveRoles(userId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveRoles = async (userId: string) => {
    const rolesToAdd: string[] = [];
    selectedUserRoles.forEach((x) => {
      rolesToAdd.push(x.name);
    });

    await addRolesToUser({
      variables: {
        userId: userId,
        roleNames: rolesToAdd,
      },
    })
      .then((response: any) => {
        setNotification({
          title: 'Successfully Added roles to User!',
          variant: NOTIFICATION.SUCCESS,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const userDetailForm = userDetailGetValues();
  console.log(userDetailForm);

  const getComponent = () => {
    return (
      <>
        <div className="rounded-lg px-4 py-0">
          <UserDetailsForm
            formKey={`createUserDetails-${new Date().getTime()}`}
            register={userDetailRegister}
            errors={userDetailFormErrors}
            setValue={userDetailSetValue}
            control={control}
          />
        </div>

        {/* <div className="mt-0 rounded-lg  px-4 py-0">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Roles
            </h3>
            <p className="text-Light text-md font-medium leading-6">
              Please select one administrator type. Once the user has been
              added, you can add additional roles.
            </p>
          </div>
          <UserRoles
            roleList={filteredRoles ? filteredRoles : []}
            roles={selectedUserRoles}
            onUserRoleChange={(values) => setUserRoles(values)}
          />
        </div> */}
        <div className="mt-0 rounded-lg  px-4 py-0">
          <Alert
            className={'mt-5 mb-3'}
            message={
              'An invitation will be sent to the new user when you click add.'
            }
            type={'info'}
          />
        </div>
      </>
    );
  };

  return (
    <article>
      {/* <UserPanelSave disabled={!getIsValid()} onSave={onSave} /> */}
      <div className="mx-1  max-w-5xl">
        {getComponent()}

        <Button
          className={'mt-6 w-full rounded-xl'}
          type="filled"
          // isLoading={isLoading}
          color={'secondary'}
          disabled={userDetailForm.email ? false : true}
          onClick={onSave}
        >
          <PaperAirplaneIcon className="mx-4 h-5 w-5 text-white"></PaperAirplaneIcon>
          <Typography
            type="help"
            color="white"
            text={'Add & invite user'}
          ></Typography>
        </Button>
      </div>
    </article>
  );
}
