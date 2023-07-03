import FormField from '../../components/form-field/form-field';
import { Config, LocalStorageKeys, useTheme } from '@ecdlink/core';
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
import { GetUserById } from '@ecdlink/graphql';
import { useLazyQuery } from '@apollo/client';
import { useUser } from '../../hooks/useUser';

export function Profile(props: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const user = useUser()

  const { register, getValues, formState, watch } = useForm({
    resolver: yupResolver(editProfileSchema),
    defaultValues: initialEditProfileValues,
    mode: 'onChange',
  });

  const { errors, isValid } = formState;

  console.log(user.user?.id)

  const [getUserById, { data: userData, refetch }] = useLazyQuery(GetUserById, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    getUserById({

    })
  }, [user])
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
                        register={register}
                        error={errors.firstName?.message}
                        defaultValue={userData?.userById?.email}
                      />
                    </div>

                    <div className="w-full pt-10">
                      <FormField
                        label={'Surname *'}
                        nameProp={'surname'}
                        register={register}
                        error={errors.surname?.message}
                        defaultValue={userData?.userById?.surname}
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
                      defaultValue={userData?.userById?.email}
                      disabled
                    />
                  </div>

                  <div className="space-y-2 pt-6 pb-4">
                    <FormField
                      label={'Password *'}
                      nameProp={'password'}
                      register={register}
                      type="password"
                      error={errors.password?.message}
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
          // onClick={signIn}
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
