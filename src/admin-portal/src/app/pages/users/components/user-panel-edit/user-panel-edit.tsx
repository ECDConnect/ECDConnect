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
  RemoveUserFromRoles,
  ResetUserPassword,
  RoleList,
  UpdateUser,
  UserModelInput,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PasswordForm from '../password-form/password-form';
import UserDetailsForm from '../user-details-form/user-details-form';
import UserHierarchy from '../user-hierarchy/user-hierarchy';
import UserPanelSave from '../user-panel-save/user-panel-save';
import UserRoles from '../user-roles/user-roles';
import { UserPanelProps } from '../users';

export default function UserPanelEdit(props: UserPanelProps) {
  const { setNotification } = useNotifications();

  const { data: roleData } = useQuery(RoleList, {
    fetchPolicy: 'cache-and-network',
  });

  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  const [addRolesToUser] = useMutation(AddUsersToRole);
  const [updateUser] = useMutation(UpdateUser);
  const [resetUserPassword] = useMutation(ResetUserPassword);
  const [removeRolesFromUser] = useMutation(RemoveUserFromRoles);

  const [selectedUserRoles, setUserRoles] = useState<RoleDto[]>([]);

  // FORMS
  // USER FORM DETAILS
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
  const { errors: passwordFormErrors, isValid: isPasswordValid } = passwordFormState;

  // SET EDIT FORMS
  useEffect(() => {
    if (props.user && userDetailFormState) {
      userDetailSetValue('email', props.user.email ?? '', {
        shouldValidate: true,
      });
      userDetailSetValue('isSouthAfricanCitizen', props.user.isSouthAfricanCitizen, {
        shouldValidate: true,
      });
      userDetailSetValue('idNumber', props.user.idNumber ?? '', {
        shouldValidate: true,
      });
      userDetailSetValue('verifiedByHomeAffairs', props.user.verifiedByHomeAffairs, {
        shouldValidate: true,
      });
      userDetailSetValue(
        'dateOfBirth',
        props.user.dateOfBirth ? new Date(props.user.dateOfBirth) : new Date(),
        {
          shouldValidate: true,
        }
      );
      userDetailSetValue('genderId', props.user.genderId, {
        shouldValidate: true,
      });
      userDetailSetValue('firstName', props.user.firstName ?? '', {
        shouldValidate: true,
      });
      userDetailSetValue('surname', props.user.surname ?? '', {
        shouldValidate: true,
      });
      userDetailSetValue('phoneNumber', props.user.phoneNumber ?? '', {
        shouldValidate: true,
      });
      userDetailSetValue('contactPreference', props.user.contactPreference ?? '', {
        shouldValidate: true,
      });
      if (props.user.roles) setUserRoles(props.user.roles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user]);

  const onSave = async () => {
    const passwordForm = passwordGetValues();
    let passwordChange = false;
    let internalIsPasswordValid = true;
    let isValid = isUserDetailValid;

    if (passwordForm.password.length > 0) {
      passwordChange = true;
      internalIsPasswordValid = isPasswordValid;
    }

    if (isValid && internalIsPasswordValid) {
      await saveUser(passwordChange);
      emitCloseDialog(true);
    }
  };

  const saveUser = async (passwordChange: boolean) => {
    const passwordForm = passwordGetValues();
    const userDetailForm = userDetailGetValues();

    const userInputModel: UserModelInput = {
      isSouthAfricanCitizen: userDetailForm.isSouthAfricanCitizen,
      idNumber: userDetailForm.idNumber,
      verifiedByHomeAffairs: userDetailForm.verifiedByHomeAffairs,
      dateOfBirth: userDetailForm.dateOfBirth,
      genderId: userDetailForm.genderId && userDetailForm.genderId,
      firstName: userDetailForm.firstName,
      surname: userDetailForm.surname,
      contactPreference: userDetailForm.contactPreference,
      phoneNumber: userDetailForm.phoneNumber,
      email: userDetailForm.email,
      password: passwordForm.password,
    };

    await updateUser({
      variables: {
        id: props.user.id,
        input: { ...userInputModel },
      },
    });

    setNotification({
      title: 'Successfully Updated User!',
      variant: NOTIFICATION.SUCCESS,
    });

    await saveRoles(props.user.id);

    if (passwordChange) {
      await resetUserPassword({
        variables: {
          id: props.user.id,
          newPassword: passwordForm.password,
        },
      });
    }
  };

  const saveRoles = async (userId?: string) => {
    // FOR EDIT USER. CURRENT ROLES THAT THE USER ALREADY HAD BEFORE THIS EDIT
    const currentUserRoleNames: string[] = [];
    if (props.user && props.user.roles) {
      props.user.roles.forEach((x: RoleDto) => {
        currentUserRoleNames.push(x.name);
      });
    }

    // USER ROLES THAT HAVE BEEN SELECTED IN THIS VIEW
    const userRoleNames: string[] = [];
    if (props.user && props.user.roles) {
      selectedUserRoles.forEach((x: RoleDto) => {
        userRoleNames.push(x.name);
      });
    }

    const rolesToRemove: string[] = [];

    if (props.user && props.user.roles) {
      props.user.roles.forEach((x: RoleDto) => {
        if (!userRoleNames.includes(x.name)) {
          rolesToRemove.push(x.name);
        }
      });
    }

    await removeRolesFromUser({
      variables: {
        roleNames: rolesToRemove,
        userId: userId,
      },
    })
      .then((response: any) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    const rolesToAdd: string[] = [];
    selectedUserRoles.forEach((x) => {
      if (!currentUserRoleNames.includes(x.name)) {
        rolesToAdd.push(x.name);
      }
    });

    await addRolesToUser({
      variables: {
        roleNames: rolesToAdd,
        userId: userId,
      },
    })
      .then((response: any) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getIsValid = () => {
    let isValid = isUserDetailValid;
    let internalIsPasswordValid = true;
    const passwordForm = passwordGetValues();

    if (passwordForm.password.length > 0) {
      internalIsPasswordValid = isPasswordValid;
    }

    return isValid && internalIsPasswordValid ? true : false;
  };

  const getComponent = () => {
    return (
      <>
        <div className="bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg">
          <div className="pb-2">
            <h3 className="text-lg leading-6 font-medium text-uiMidDark">User Detail</h3>
          </div>
          <UserDetailsForm
            formKey={`editUserDetails-${new Date().getTime()}-${props.user?.id}`}
            register={userDetailRegister}
            errors={userDetailFormErrors}
            setValue={userDetailSetValue}
            user={props.user}
            control={control}
          />
        </div>
        <div className="mt-5 bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg">
          <div className="pb-2">
            <h3 className="text-lg leading-6 font-medium text-uiMidDark">Password</h3>
          </div>
          <PasswordForm
            formKey={`editpassword-${new Date().getTime()}-${props.user?.id}`}
            isEdit={true}
            register={passwordRegister}
            errors={passwordFormErrors}
          />
        </div>
        <div className="mt-5 bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg">
          <div className="pb-2">
            <h3 className="text-lg leading-6 font-medium text-uiMidDark">Roles</h3>
          </div>
          <UserRoles
            roleList={roleData ? roleData.roles : []}
            roles={selectedUserRoles}
            onUserRoleChange={(values) => setUserRoles(values)}
          />
        </div>
        <div className="mt-5 bg-uiBg px-4 py-5 border-b border-gray-200 rounded-lg">
          <UserHierarchy userId={props.user.id} />
        </div>
      </>
    );
  };

  return (
    <article>
      <UserPanelSave user={props.user} disabled={!getIsValid()} onSave={onSave} />
      <div className="mt-5 max-w-5xl mx-auto">{getComponent()}</div>
    </article>
  );
}
