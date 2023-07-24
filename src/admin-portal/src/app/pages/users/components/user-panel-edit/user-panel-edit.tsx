import { useMutation, useQuery } from '@apollo/client';
import {
  initialPasswordValue,
  initialUserDetailsValues,
  NOTIFICATION,
  passwordSchema,
  RoleDto,
  useDialog,
  useNotifications,
  userSchema,
} from '@ecdlink/core';
import {
  AddUsersToRole,
  DeleteUser,
  RemoveUserFromRoles,
  ResetUserPassword,
  RoleList,
  UpdateUser,
  UserList,
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
import { Button, DialogPosition, Typography } from '@ecdlink/ui';
import { PaperAirplaneIcon, SaveIcon } from '@heroicons/react/solid';
import AlertModal from '../../../../components/dialog-alert/dialog-alert';

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

  // SET EDIT FORMS
  useEffect(() => {
    if (props.user && userDetailFormState) {
      userDetailSetValue('email', props.user.email ?? '', {
        shouldValidate: true,
      });

      userDetailSetValue('firstName', props.user.firstName ?? '', {
        shouldValidate: true,
      });
      userDetailSetValue('surname', props.user.surname ?? '', {
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
      firstName: userDetailForm.firstName,
      surname: userDetailForm.surname,
      email: userDetailForm.email,
      dateOfBirth: new Date(),
      isSouthAfricanCitizen: true,
      verifiedByHomeAffairs: true,
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
  const dialog = useDialog();

  const { data, refetch } = useQuery(UserList, {
    fetchPolicy: 'cache-and-network',
  });
  const [deleteUser] = useMutation(DeleteUser);

  const deleteUserAndRefresh = async (user: any) => {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Deactivate Administrator"
          message={`You are about to deactivate a user. Would you like to go ahead`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();

            deleteUser({
              variables: {
                id: user.id,
              },
            })
              .then((response: any) => {
                if (response.data.deleteUser) {
                  refetch();

                  setNotification({
                    title: 'Successfully Deactivated User!',
                    variant: NOTIFICATION.SUCCESS,
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
      ),
    });
  };

  const getComponent = () => {
    return (
      <>
        <div className="px-4 ">
          <div className="border-b border-dashed pb-4">
            <h1 className="py-4 text-2xl text-black">
              {' '}
              Edit Administrator details
            </h1>
            <div className="rounded-lg border-t border-dashed border-gray-200 px-4 py-5">
              <div className="pb-2">
                <h3 className="text-uiMidDark text-lg font-medium leading-6">
                  User Detail
                </h3>
              </div>
              <UserDetailsForm
                formKey={`editUserDetails-${new Date().getTime()}-${
                  props.user?.id
                }`}
                register={userDetailRegister}
                errors={userDetailFormErrors}
                setValue={userDetailSetValue}
                user={props.user}
                control={control}
              />
            </div>

            <div className="rounded-lg px-4 ">
              <div className="pb-2">
                <h3 className="text-uiMidDark text-lg font-medium leading-6">
                  Roles
                </h3>
              </div>
              <UserRoles
                roleList={roleData ? roleData.roles : []}
                roles={selectedUserRoles}
                onUserRoleChange={(values) => setUserRoles(values)}
              />
            </div>
          </div>
        </div>

        {/* <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <UserHierarchy userId={props.user.id} />
        </div> */}
      </>
    );
  };

  return (
    <article>
      {/* <UserPanelSave
        user={props.user}
        disabled={!getIsValid()}
        onSave={onSave}
      /> */}
      <div className="mx-auto mt-5 max-w-5xl">{getComponent()}</div>
      <div className="flex flex-row">
        <Button
          className={'m-2 mt-6 w-full rounded-xl'}
          type="filled"
          // isLoading={isLoading}
          color={'secondary'}
          // disabled={userDetailForm.email ? false : true}
          onClick={onSave}
        >
          <SaveIcon className="mx-4 h-5 w-5 text-white"></SaveIcon>
          <Typography
            type="help"
            color="white"
            text={'Save Changes'}
          ></Typography>
        </Button>
        <Button
          className={'border-tertiary m-2 mt-6 w-full rounded-xl border-2'}
          type="outlined"
          color="tertiary"
          onClick={() => deleteUserAndRefresh(props.user?.id)}
        >
          <Typography
            type="button"
            color="tertiary"
            text={'Deactivate user'}
          ></Typography>
        </Button>
      </div>
    </article>
  );
}
