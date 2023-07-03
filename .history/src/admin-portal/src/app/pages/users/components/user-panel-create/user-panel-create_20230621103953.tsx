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
  SendInviteToApplication,
  UserModelInput,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newGuid } from '../../../../utils/uuid.utils';
import UserDetailsForm from '../user-details-form/user-details-form';
import { UserPanelCreateProps } from '../users';
import { Alert, Button, Typography } from '@ecdlink/ui';
import UserPanelSave from '../user-panel-save/user-panel-save';
import { SaveIcon } from '@heroicons/react/solid';
import FormField from '../../../../components/form-field/form-field';

export default function UserPanelCreate(props: UserPanelCreateProps) {
  const { setNotification } = useNotifications();
  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  const { data: roleData } = useQuery(RoleList, {
    fetchPolicy: 'cache-and-network',
  });
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);
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


  const saveUser = async () => {
    const userDetailForm = userDetailGetValues();
    const userInputModel: UserModelInput = {
      id: newGuid(),
      firstName: userDetailForm.firstName,
      surname: userDetailForm.surname,
      email: userDetailForm.email,
      dateOfBirth: new Date(),
      isSouthAfricanCitizen: true,
      verifiedByHomeAffairs: true

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
        await sendInviteToApplication({
          variables: {
            userId: userId,
          },
        });
        setNotification({
          title: 'Successfully User an Invite!',
          variant: NOTIFICATION.SUCCESS,
        });
        await saveRoles(userId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveRoles = async (userId: string) => {
    const rolesToAdd: string[] = ["Administrator"];
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
  console.log(userDetailFormState.isValid);

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
          <form key={`${new Date()}`} className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-0">

              <div className="grid grid-cols-1 ">
                <div className="my-4 sm:col-span-3">
                  <FormField
                    label={'First name *'}
                    nameProp={'firstName'}
                    register={userDetailRegister}
                    error={userDetailFormErrors.firstName?.message}
                    placeholder="First name"
                  />
                </div>
                <div className="my-4 sm:col-span-3">
                  <FormField
                    label={'Surname *'}
                    nameProp={'surname'}
                    register={userDetailRegister}
                    error={userDetailFormErrors.surname?.message}
                    placeholder="Surname/family name"
                  />
                </div>
                <div className="my-4 sm:col-span-3">
                  <FormField
                    label={'Work email address *'}
                    nameProp={'email'}
                    register={userDetailRegister}
                    error={userDetailFormErrors.email?.message}
                    placeholder="e.g name@email.com"
                  />
                </div>
              </div>
            </div>
          </form>
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
          <Button
            className={'mt-3  rounded mr-6 w-full'}
            type="filled"
            // isLoading={isLoading}
            color="secondary"
            disabled={userDetailForm.firstName === '' ? true : false}
            onClick={onSave}
          >
            <SaveIcon color='white' className='w-6 h-6 mr-6'> </SaveIcon>
            <Typography
              type="help"
              color="white"
              text={'Send Invitation'}
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