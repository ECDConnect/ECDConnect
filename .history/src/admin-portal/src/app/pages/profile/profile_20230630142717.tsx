import FormField from '../../components/form-field/form-field';
import { Config, LocalStorageKeys, initialPasswordValue, initialUserDetailsValues, passwordSchema, useTheme, userSchema, NOTIFICATION, useNotifications, } from '@ecdlink/core';
import {
  initialEditProfileValues,
  editProfileSchema,
} from '../../schemas/edit-profile-request';
import { EditProfileRequestModel } from '../../models/EditProfile';
// import { useDocuments } from '../../../../../lxp/src/hooks/useDocuments';
import { Alert, Button, Divider, ProfileAvatar, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import zxcvbn from 'zxcvbn-typescript';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { GetUserById, ResetUserPassword, UpdateUser, UserModelInput } from '@ecdlink/graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useUser } from '../../hooks/useUser';

export function Profile(props: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [resetUserPassword] = useMutation(ResetUserPassword);
  const user = useUser()
  const { setNotification } = useNotifications();

  console.log(user)
  const {
    register: userDetailRegister,
    setValue: userDetailSetValue,
    formState: userDetailFormState,
    getValues: userDetailGetValues,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });

  const {
    register: passwordRegister,
    formState: passwordFormState,
    getValues: passwordGetValues,
    watch
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onChange',
  });

  const { errors: passwordFormErrors, isValid: isPasswordValid } =
    passwordFormState;

  const { errors, isValid } = userDetailFormState;

  const [getUserById, { data: userData, refetch }] = useLazyQuery(GetUserById, {
    variables: {
      userId: user.user?.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [updateUser, { loading }] = useMutation(UpdateUser);
  const passwordForm = passwordGetValues();
  const userDetailForm = userDetailGetValues();

  const saveUser = async (passwordChange: boolean) => {

    const userInputModel: UserModelInput = {
      phoneNumber: userDetailForm?.phoneNumber,
      idNumber: userDetailForm?.idNumber,
      email: userDetailForm?.email,
      dateOfBirth: null,
      isSouthAfricanCitizen: null,
      verifiedByHomeAffairs: null
    };


    await updateUser({
      variables: {
        id: user.user?.id,
        input: { ...userInputModel },
      }
    });
    setNotification({
      title: 'Successfully Updated User!',
      variant: NOTIFICATION.SUCCESS,
    });

    if (passwordChange) {
      await resetUserPassword({
        variables: {
          id: user.user?.id,
          newPassword: passwordForm.password,
        },
      });
    }
  };

  const onSave = async () => {
    let passwordChange = false;
    let internalIsPasswordValid = true;

    if (passwordForm.password.length > 0) {
      passwordChange = true;
      internalIsPasswordValid = isPasswordValid;
    }

    await saveUser(passwordChange);

  };

  useEffect(() => {
    getUserById({
      variables: {
        userId: user.user?.id,
      },
    })
  }, [user])


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (user && userDetailFormState) {
      userDetailSetValue('firstName', (user.user?.idNumber), {
        shouldValidate: true,
      });

      userDetailSetValue('surname', (user.user?.surname), {
        shouldValidate: true,
      });

      userDetailSetValue('email', (user.user?.email), {
        shouldValidate: true,
      });

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  //check password strength
  const password = watch('password');
  const formValues = userDetailGetValues();
  const passwordStrength = zxcvbn(password);
  const passwordScore = passwordStrength.score; // Assuming you have a variable to store the password strength score
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const displayProfilePicturePrompt = () => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  };
  // const {
  //   userProfilePicture,
  //   createNewDocument,
  //   updateDocument,
  //   deleteDocument,
  // } = useDocuments();

  const picturePromtOnAction = async (imageBaseString: string) => {
    setEditProfilePictureVisible(!editProfilePictureVisible);

  };
  return (
    <div className="bg-red flex min-w-0 flex-col xl:flex">
      <form className="space-y-6">
        <div className="m-10 rounded-2xl bg-white  lg:min-w-0 lg:flex-1">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}

            <div className="flex h-full " style={{ minHeight: '30rem' }}>
              <div className="p-6 dark:bg-gray-900 dark:text-gray-100 sm:p-12">
                <div
                  className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6  "
                  style={{ width: '50rem' }}
                >
                  <ProfileAvatar
                    // dataUrl={ ?? ''}
                    size={'header'}
                    onPressed={displayProfilePicturePrompt}
                    hasConsent={true}
                  />

                  <div className="flex w-full flex-col">
                    <div>
                      <FormField
                        label={'First Name *'}
                        nameProp={'firstName'}
                        register={userDetailRegister}
                        error={errors.firstName?.message}
                        defaultValue={user.user?.firstName}
                      />
                    </div>

                    <div className="w-full pt-10">
                      <FormField
                        label={'Surname *'}
                        nameProp={'surname'}
                        register={userDetailRegister}
                        error={errors.surname?.message}
                        defaultValue={user.user?.surname}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col pt-6">
                  <div>
                    <FormField
                      label={'Email address *'}
                      nameProp={'email'}
                      register={userDetailRegister}
                      defaultValue={user.user?.email}
                      disabled
                    />
                  </div>

                  <div className="space-y-2 pt-6 pb-4">
                    <FormField
                      label={'Password *'}
                      nameProp={'password'}
                      register={passwordRegister}
                      type="password"
                      error={passwordFormErrors?.password?.message}
                      showPassword={showPassword}
                      togglePasswordVisibility={togglePasswordVisibility}
                    />
                  </div>
                  <div className="-mx-1 flex">
                    {[...Array(4)].map((_, i) => (
                      <div className="w-1/4 px-1" key={i}>
                        <div
                          className={`h-2 rounded-xl transition-colors ${i < passwordScore
                            ? passwordScore <= 2
                              ? 'bg-red-400'
                              : passwordScore <= 3
                                ? 'bg-yellow-400'
                                : passwordScore <= 4
                                  ? 'bg-green-500'
                                  : 'bg-yellow-400'
                            : 'bg-gray-200'
                            }`}
                        ></div>
                      </div>
                    ))}
                  </div>
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
            isLoading={isLoading}
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
      </form>
    </div>
  );
}

export default Profile;
