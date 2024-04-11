import FormField from '../../components/form-field/form-field';
import {
  initialPasswordValue,
  initialUserDetailsValues,
  passwordSchema,
  NOTIFICATION,
  useNotifications,
} from '@ecdlink/core';

import {
  ActionModal,
  Button,
  Dialog,
  DialogPosition,
  ProfileAvatar,
  SA_CELL_REGEX,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  GetTeamLead,
  GetUserById,
  ResetUserPassword,
  UpdateUser,
  UserModelInput,
} from '@ecdlink/graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useUser } from '../../hooks/useUser';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PasswordInput } from '../../components/password-input/password-input';
import { SuperAdminProfile } from './components/superAdminProfile';
import { useUserRole } from '../../hooks/useUserRole';

export const userSchema = yup.object().shape({
  firstName: yup.string().required('First name is Required'),
  surname: yup.string().required('Surname is Required'),
  email: yup.string().email('Invalid email'),
  phoneNumber: yup.string().matches(SA_CELL_REGEX, 'Phone number is not valid'),
  whatsAppNumber: yup
    .string()
    .matches(SA_CELL_REGEX, 'Phone number is not valid'),
});

export function Profile(props: any) {
  const [resetUserPassword] = useMutation(ResetUserPassword);
  const user = useUser();
  const { setNotification } = useNotifications();
  const [handleChangePassword, setHandleChangePassword] = useState(false);
  const [handleChangePhoneNumber, setHandleChangePhoneNumber] = useState(false);
  const [
    handleChangePasswordAndPhoneNumber,
    setHandleChangePasswordAndPhoneNumber,
  ] = useState(false);

  const { register, formState, getValues, handleSubmit, setValue } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });

  const { errors, isValid } = formState;
  const {
    register: passwordRegister,
    formState: passwordFormState,
    getValues: passwordGetValues,
    setValue: passwordSetValue,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onChange',
  });

  const { errors: passwordFormErrors, isValid: isPasswordValid } =
    passwordFormState;

  const [getUserById, { data: userData, refetch }] = useLazyQuery(GetUserById, {
    variables: {
      userId: user.user?.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [updateUser, { loading }] = useMutation(UpdateUser);
  const { isAdministrator, isSuperAdmin, isTeamLead } = useUserRole();

  const [getTeamLeadData, { data: teamLeadData }] = useLazyQuery(GetTeamLead, {
    variables: {
      teamLeadId: '',
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (isTeamLead && userData?.userById?.id) {
      getTeamLeadData({
        variables: {
          teamLeadId: userData?.userById?.id!,
        },
      });
    }
  }, [getTeamLeadData, isTeamLead, userData?.userById?.id]);

  const passwordForm = passwordGetValues();
  const userDetailForm = getValues();
  const [avatarFile, setAvatarFile] = useState(null);

  const saveUser = async (passwordChange: boolean, profileImage?: string) => {
    const userInputModel: UserModelInput = {
      firstName: userDetailForm?.firstName,
      surname: userDetailForm?.surname,
      email: userDetailForm?.email,
      dateOfBirth: null,
      isSouthAfricanCitizen: null,
      verifiedByHomeAffairs: null,
      profileImageUrl: profileImage ?? userData.userById?.profileImageUrl,
      phoneNumber: userDetailForm?.phoneNumber,
    };

    await updateUser({
      variables: {
        id: user.user?.id,
        input: { ...userInputModel },
      },
    })
      .then(() => {
        setNotification({
          title: 'Successfully Updated User!',
          variant: NOTIFICATION.SUCCESS,
        });
      })
      .catch((error) => {
        setNotification({
          title: 'Failed to Update User!',
          variant: NOTIFICATION.ERROR,
        });
      });
    refetch();

    if (passwordChange) {
      await resetUserPassword({
        variables: {
          id: user.user?.id,
          newPassword: passwordForm.password,
        },
      });
      passwordSetValue('password', '', {
        shouldValidate: true,
      });
    }
    refetch();
  };

  const onSave = async () => {
    let passwordChange = false;
    let internalIsPasswordValid = true;

    if (
      passwordForm.password.length > 0 &&
      userDetailForm?.phoneNumber !== user.user?.phoneNumber
    ) {
      passwordChange = true;
      internalIsPasswordValid = isPasswordValid;
      setHandleChangePasswordAndPhoneNumber(true);
      return;
    }

    if (passwordForm.password.length > 0) {
      passwordChange = true;
      internalIsPasswordValid = isPasswordValid;
      setHandleChangePassword(true);
      return;
    }

    if (userDetailForm?.phoneNumber !== user.user?.phoneNumber) {
      setHandleChangePhoneNumber(true);
      return;
    }

    if (avatarFile) {
      await saveUser(passwordChange, avatarFile);
    } else {
      await saveUser(passwordChange);
    }
  };

  useEffect(() => {
    getUserById({
      variables: {
        userId: user.user?.id,
      },
    });
  }, [user]);

  useEffect(() => {
    if (user) {
      setValue('firstName', user.user?.firstName, {
        shouldValidate: true,
      });

      setValue('surname', user.user?.surname, {
        shouldValidate: true,
      });

      setValue('email', user.user?.email, {
        shouldValidate: true,
      });

      setValue('phoneNumber', user.user?.phoneNumber, {
        shouldValidate: true,
      });

      setValue('whatsAppNumber', user.user?.whatsAppNumber, {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result; // The base64 data URL
        setAvatarFile(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayProfilePicturePrompt = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', handleAvatarChange);

    document.body.appendChild(fileInput);
    fileInput.click();
  };

  return (
    <div className="bg-red flex min-w-0 flex-col xl:flex">
      <form className="space-y-6">
        <div className="m-10 rounded-2xl bg-white  lg:min-w-0 lg:flex-1">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}

            <div className="flex h-full " style={{ minHeight: '30rem' }}>
              <div className="p-6 dark:bg-gray-900 dark:text-gray-100 sm:p-12">
                {!isSuperAdmin && (
                  <div
                    className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6  "
                    style={{ width: '50rem' }}
                  >
                    <ProfileAvatar
                      dataUrl={
                        avatarFile ?? userData?.userById?.profileImageUrl
                      }
                      size={'header'}
                      onPressed={displayProfilePicturePrompt}
                      hasConsent={true}
                    />

                    <div className="flex w-full flex-col">
                      <div>
                        <FormField
                          label={'First Name *'}
                          nameProp={'firstName'}
                          register={register}
                          error={errors.firstName?.message}
                        />
                      </div>

                      <div className="w-full pt-10">
                        <FormField
                          label={'Surname *'}
                          nameProp={'surname'}
                          register={register}
                          error={errors.surname?.message}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex w-full flex-col pt-6">
                  {isSuperAdmin && (
                    <div>
                      <SuperAdminProfile user={user} />
                    </div>
                  )}
                  {!isAdministrator && !isSuperAdmin && !isTeamLead && (
                    <div>
                      <FormField
                        label={'Email address *'}
                        nameProp={'email'}
                        register={register}
                        disabled
                        error={errors.email?.message}
                      />
                    </div>
                  )}

                  {isTeamLead && (
                    <div>
                      <div className="w-full pt-10">
                        <FormField
                          label={'Cellphone number *'}
                          nameProp={'phoneNumber'}
                          register={register}
                          error={errors.phoneNumber?.message}
                        />
                      </div>
                      <div className="mt-2 w-full pt-10">
                        <FormField
                          label={'WhatsApp number'}
                          subLabel="Optional. If your WhatsApp number is different from your cellphone number, you can add it below. This will help CHWs to connect with you through WhatsApp, if needed."
                          nameProp={'whatsAppNumber'}
                          register={register}
                          error={errors.whatsappNumber?.message}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-6 pb-4">
                    <PasswordInput
                      label={'Password'}
                      nameProp={'password'}
                      sufficIconColor="black"
                      value={passwordForm.password}
                      register={passwordRegister}
                      strengthMeterVisible={true}
                      className="mb-9 "
                    />
                  </div>
                  {isTeamLead && (
                    <div className="mt-2 w-full pt-10">
                      <FormField
                        label={
                          'In 4 or 5 words, share something about yourself with your CHWs!'
                        }
                        subLabel="Optional"
                        defaultValue={
                          teamLeadData?.GetAllTeamLead?.[0]?.welcomeMessage &&
                          teamLeadData?.GetAllTeamLead?.[0]?.welcomeMessage
                        }
                        nameProp={'lockoutEnd'}
                        register={register}
                        disabled={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* End main area */}
          </div>
        </div>
        <div className="pl-4">
          <Button
            className={'mt-3 w-4/12 rounded'}
            type="filled"
            isLoading={loading}
            color="secondary"
            disabled={!isValid}
            onClick={handleSubmit(onSave)}
          >
            <Typography
              type="help"
              color="white"
              text={'Update profile'}
            ></Typography>
          </Button>
        </div>
        <Dialog
          className="right-50 absolute w-6/12"
          stretch
          visible={handleChangePassword}
          position={DialogPosition.Middle}
        >
          <ActionModal
            className="z-80"
            icon={'InformationCircleIcon'}
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={`Are you sure you want to change your password?`}
            detailText="You will need to use the new password to log in."
            actionButtons={[
              {
                text: 'Yes, change password',
                textColour: 'secondary',
                colour: 'secondary',
                type: 'outlined',
                onClick: async () => {
                  avatarFile
                    ? await saveUser(true, avatarFile)
                    : await saveUser(true);
                  setHandleChangePassword(false);
                },
                leadingIcon: 'CheckCircleIcon',
              },
              {
                text: 'No, cancel',
                textColour: 'white',
                colour: 'secondary',
                type: 'filled',
                onClick: () => setHandleChangePassword(false),
                leadingIcon: 'XIcon',
              },
            ]}
          />
        </Dialog>
        <Dialog
          className="right-50 absolute w-6/12"
          stretch
          visible={handleChangePhoneNumber}
          position={DialogPosition.Middle}
        >
          <ActionModal
            className="z-80"
            icon={'InformationCircleIcon'}
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={`Are you sure you want to edit your cellphone number?`}
            detailText="You will need to verify the new cellphone number."
            actionButtons={[
              {
                text: 'Yes, save new cellphone number',
                textColour: 'white',
                colour: 'secondary',
                type: 'filled',
                onClick: async () => {
                  avatarFile
                    ? await saveUser(false, avatarFile)
                    : await saveUser(false);
                  setHandleChangePhoneNumber(false);
                },
                leadingIcon: 'CheckCircleIcon',
              },
              {
                text: 'No, cancel',
                textColour: 'secondary',
                colour: 'secondary',
                type: 'outlined',
                onClick: () => setHandleChangePhoneNumber(false),
                leadingIcon: 'XIcon',
              },
            ]}
          />
        </Dialog>
        <Dialog
          className="right-50 absolute w-6/12"
          stretch
          visible={handleChangePasswordAndPhoneNumber}
          position={DialogPosition.Middle}
        >
          <ActionModal
            className="z-80"
            icon={'InformationCircleIcon'}
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={`Are you sure you want to change your password and cellphone number?`}
            detailText="You will need to verify the new cellphone number and use the new password to log in."
            actionButtons={[
              {
                text: 'Yes, change login details',
                textColour: 'white',
                colour: 'secondary',
                type: 'filled',
                onClick: async () => {
                  avatarFile
                    ? await saveUser(true, avatarFile)
                    : await saveUser(true);
                  setHandleChangePasswordAndPhoneNumber(false);
                },
                leadingIcon: 'CheckCircleIcon',
              },
              {
                text: 'No, cancel',
                textColour: 'secondary',
                colour: 'secondary',
                type: 'outlined',
                onClick: () => setHandleChangePasswordAndPhoneNumber(false),
                leadingIcon: 'XIcon',
              },
            ]}
          />
        </Dialog>
      </form>
    </div>
  );
}

export default Profile;
