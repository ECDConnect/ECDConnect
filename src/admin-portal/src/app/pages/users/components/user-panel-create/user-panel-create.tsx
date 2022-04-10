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
import { AddUsersToRole, CreateUser, RoleList, UserModelInput } from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newGuid } from '../../../../utils/uuid.utils';
import PasswordForm from '../password-form/password-form';
import UserDetailsForm from '../user-details-form/user-details-form';
import UserPanelSave from '../user-panel-save/user-panel-save';
import UserRoles from '../user-roles/user-roles';
import { UserPanelCreateProps } from '../users';

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
        (x: RoleDto) => x.name !== 'Practitioner' && x.name !== 'Coach' && x.name !== 'Child'
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
  const { errors: userDetailFormErrors, isValid: isUserDetailValid } = userDetailFormState;

  const {
    register: passwordRegister,
    formState: passwordFormState,
    getValues: passwordGetValues,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onBlur',
  });
  const { errors: passwordFormErrors, isValid: isPasswordValid } = passwordFormState;

  const onSave = async () => {
    await saveUser();
    emitCloseDialog(true);
  };

  const saveUser = async () => {
    const userDetailForm = userDetailGetValues();
    const passwordForm = passwordGetValues();

    const userInputModel: UserModelInput = {
      id: newGuid(),
      isSouthAfricanCitizen: userDetailForm.isSouthAfricanCitizen,
      idNumber: userDetailForm.idNumber,
      verifiedByHomeAffairs: userDetailForm.verifiedByHomeAffairs,
      dateOfBirth: userDetailForm.dateOfBirth,
      genderId: userDetailForm.genderId && +userDetailForm.genderId,
      firstName: userDetailForm.firstName,
      surname: userDetailForm.surname,
      contactPreference: userDetailForm.contactPreference,
      phoneNumber: userDetailForm.phoneNumber,
      email: userDetailForm.email,
      password: passwordForm.password,
    };

    await createUser({
      variables: {
        input: { ...userInputModel },
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

  const getIsValid = () => {
    let isValid = isUserDetailValid;
    return isValid && isPasswordValid ? true : false;
  };

  const getComponent = () => {
    return (
      <>
        <div className="bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg">
          <div className="pb-2">
            <h3 className="text-lg leading-6 font-medium text-uiMidDark">User Detail</h3>
          </div>
          <UserDetailsForm
            formKey={`createUserDetails-${new Date().getTime()}`}
            register={userDetailRegister}
            errors={userDetailFormErrors}
            setValue={userDetailSetValue}
            control={control}
          />
        </div>
        <div className="mt-5 bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg">
          <div className="pb-2">
            <h3 className="text-lg leading-6 font-medium text-uiMidDark">Password</h3>
          </div>

          <PasswordForm
            formKey={`createPassword-${new Date().getTime()}`}
            isEdit={false}
            register={passwordRegister}
            errors={passwordFormErrors}
          />
        </div>
        <div className="mt-5 bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg">
          <div className="pb-2">
            <h3 className="text-lg leading-6 font-medium text-uiMidDark">Roles</h3>
          </div>
          <UserRoles
            roleList={filteredRoles ? filteredRoles : []}
            roles={selectedUserRoles}
            onUserRoleChange={(values) => setUserRoles(values)}
          />
        </div>
      </>
    );
  };

  return (
    <article>
      <UserPanelSave disabled={!getIsValid()} onSave={onSave} />
      <div className="mt-5 max-w-5xl mx-auto">{getComponent()}</div>
    </article>
  );
}
