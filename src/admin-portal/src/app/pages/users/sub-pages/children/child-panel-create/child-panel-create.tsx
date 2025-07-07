/* eslint-disable react-hooks/rules-of-hooks */
/* This example requires Tailwind CSS v2.0+ */

import { useMutation, useQuery } from '@apollo/client';
import {
  AddUsersToRole,
  ChildInput,
  CreateChild,
  CreateUser,
  RoleList,
  UserModelInput,
} from '@ecdlink/graphql';
import {
  NOTIFICATION,
  useNotifications,
  RoleDto,
  childSchema,
  initialChildValues,
  initialPasswordValue,
  initialUserDetailsValues,
  passwordSchema,
  userSchema,
  RoleSystemNameEnum,
} from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ChildForm from '../../../components/child-form/child-form';
import PasswordForm from '../../../components/password-form/password-form';
import UserDetailsForm from '../../../components/user-details-form/user-details-form';
import UserPanelSave from '../../../components/user-panel-save/user-panel-save';
import UserRoles from '../../../components/user-roles/user-roles';
import { UserPanelCreateProps } from '../../../components/users';
import { newGuid } from '../../../../../utils/uuid.utils';

export default function ChildPanelCreate(props: UserPanelCreateProps) {
  const { setNotification } = useNotifications();
  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  // GET
  const { data: roleData } = useQuery(RoleList, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (roleData?.roles) {
      addUserRole();
    }
  }, [roleData]);

  // CREATE
  const [createUser] = useMutation(CreateUser);
  const [createChild] = useMutation(CreateChild);
  const [addRolesToUser] = useMutation(AddUsersToRole);

  const [selectedUserRoles, setUserRoles] = useState<RoleDto[]>([]);

  // FORMS
  // USER FORM DETAILS
  const {
    register: userDetailRegister,
    setValue: userDetailSetValue,
    formState: userDetailFormState,
    getValues: userDetailGetValues,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onBlur',
  });
  const { errors: userDetailFormErrors, isValid: isUserDetailValid } =
    userDetailFormState;
  // PASSWORD FORMS
  const {
    register: passwordRegister,
    formState: passwordFormState,
    getValues: passwordGetValues,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onBlur',
  });
  const { errors: passwordFormErrors, isValid: isPasswordValid } =
    passwordFormState;
  // CHILD FORMS
  const {
    register: childRegister,
    formState: childFormState,
    getValues: childGetValues,
  } = useForm({
    resolver: yupResolver(childSchema),
    defaultValues: initialChildValues,
    mode: 'onBlur',
  });
  const { errors: childFormErrors, isValid: isChildValid } = childFormState;
  // END FORMS

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
        await saveChild(userId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveChild = async (userId: string) => {
    const childForm = childGetValues();
    const childInputModel: ChildInput = {
      Id: undefined,
      UserId: userId,
      Allergies: childForm.allergies,
      Disabilities: childForm.disabilities,
      OtherHealthConditions: childForm.otherHealthConditions,
      LanguageId: childForm.languageId && +childForm.languageId,
      IsActive: true,
    };

    await createChild({
      variables: {
        input: { ...childInputModel },
      },
    });

    setNotification({
      title: 'Successfully Created Child!',
      variant: NOTIFICATION.SUCCESS,
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

  const addUserRole = () => {
    const role = roleData.roles.find(
      (role: RoleDto) => role.systemName === RoleSystemNameEnum.Child
    );

    const copy = [...selectedUserRoles];
    if (!copy.some((x) => x.id === role.id)) {
      copy.push(role);
    }
    setUserRoles(copy);
  };

  const getIsValid = () => {
    let isValid = isUserDetailValid;
    if (!isChildValid) isValid = false;
    return isValid && isPasswordValid ? true : false;
  };

  const getComponent = () => {
    return (
      <>
        <div className="bg-uiBg rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              User Detail
            </h3>
          </div>

          <UserDetailsForm
            formKey={`createUserDetails-${new Date().getTime()}`}
            register={userDetailRegister}
            errors={userDetailFormErrors}
            setValue={userDetailSetValue}
            control={control}
          />
        </div>

        <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Child Detail
            </h3>
          </div>

          <ChildForm
            formKey={`createChild-${new Date().getTime()}`}
            register={childRegister}
            errors={childFormErrors}
          />
        </div>

        <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Password
            </h3>
          </div>

          <PasswordForm
            formKey={`createPassword-${new Date().getTime()}`}
            isEdit={false}
            register={passwordRegister}
            errors={passwordFormErrors}
          />
        </div>
        <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Roles
            </h3>
          </div>
          <UserRoles
            roleList={roleData ? roleData.roles : []}
            roles={selectedUserRoles}
            onUserRoleChange={(values: RoleDto[]) => setUserRoles(values)}
          />
        </div>
      </>
    );
  };

  return (
    <article>
      <UserPanelSave disabled={!getIsValid()} onSave={onSave} />

      <div className="mx-auto mt-5 max-w-5xl">{getComponent()}</div>
    </article>
  );
}
