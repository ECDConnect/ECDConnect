import FormField from '../../components/form-field/form-field';
import { initialPasswordValue, initialUserDetailsValues, passwordSchema, NOTIFICATION, useNotifications, } from '@ecdlink/core';

import { Button, ProfileAvatar, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import zxcvbn from 'zxcvbn-typescript';
import { GetUserById, ResetUserPassword, UpdateUser, UserModelInput } from '@ecdlink/graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useUser } from '../../hooks/useUser';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const userSchema = yup.object().shape({
  firstName: yup.string().required('First name is Required'),
  surname: yup.string().required('Surname is Required'),
  email: yup.string().email('Invalid email'),
});

export function Profile(props: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [resetUserPassword] = useMutation(ResetUserPassword);
  const user = useUser()
  const { setNotification } = useNotifications();


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
    watch
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
  const passwordForm = passwordGetValues();
  const userDetailForm = getValues();
  const [avatarFile, setAvatarFile] = useState(null);

  const saveUser = async (passwordChange: boolean) => {

    const userInputModel: UserModelInput = {
      phoneNumber: userDetailForm?.phoneNumber,
      idNumber: userDetailForm?.idNumber,
      email: userDetailForm?.email,
      dateOfBirth: null,
      isSouthAfricanCitizen: null,
      verifiedByHomeAffairs: null,
      profileImageUrl: avatarFile
    };
    console.log(userDetailForm)

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
    if (user) {
      setValue('firstName', (user.user?.idNumber), {
        shouldValidate: true,
      });

      setValue('surname', (user.user?.surname), {
        shouldValidate: true,
      });

      setValue('email', (user.user?.email), {
        shouldValidate: true,
      });

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  //check password strength
  const password = watch('password');
  const formValues = getValues();
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



  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);
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
           
                  <input type="file" accept="image/*" onChange={handleAvatarChange} >
                  <ProfileAvatar
                    dataUrl={avatarFile ?? ''}
                    size={'header'}
                    onPressed={displayProfilePicturePrompt}
                    hasConsent={true}
                  />
                  </input>

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
                <div className="flex w-full flex-col pt-6">
                  <div>
                    <FormField
                      label={'Email address *'}
                      nameProp={'email'}
                      register={register}
                      disabled
                      error={errors.email?.message}
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
