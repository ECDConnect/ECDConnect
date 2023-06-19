import FormField from '../../components/form-field/form-field';
import { Button, Typography } from '@ecdlink/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import zxcvbn from 'zxcvbn-typescript';
import { ArrowRightIcon } from '@heroicons/react/solid';
import Breadcrumb from '../../components/breadcrumbs';

export function ViewUser(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const { register, getValues, formState, watch } = useForm({
    // resolver: yupResolver(editProfileSchema),
    // defaultValues: initialEditProfileValues,
    mode: 'onChange',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  let userId = localStorage.getItem("selectedUser");

  console.log(">rowDta>>", userId)

  //check password strength
  const password = watch('password');
  const formValues = getValues();
  // const passwordStrength = zxcvbn(password);
  // const passwordScore = passwordStrength.score; // Assuming you have a variable to store the password strength score
  const passwordScore = 2;

  const { errors, isValid } = formState;
  const [editActive, setEditActive] = useState<boolean>(false);

  const personalEditInformationComponent = (editState: boolean) => {
    return <form className="space-y-6">
      <div className="m-10 rounded-2xl bg-white  lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          {/* Start main area*/}

          <div className="flex h-full " style={{ minHeight: '30rem' }}>
            <div className="p-6 dark:bg-gray-900 dark:text-gray-100 sm:p-12">
              <div
                className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6  "
                style={{ width: '50rem' }}
              >
                <img
                  src="https://source.unsplash.com/75x75/?portrait"
                  alt=""
                  className="h-40 w-40 mr-10 flex-shrink-0 self-center rounded-full md:justify-self-start"
                />
                <div className="top-170 absolute left-20  flex h-8 w-8 items-center justify-center rounded-full bg-black">
                  <svg
                    className="h-4 w-4 fill-current text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0c-5.522 0-10 4.478-10 10 0 5.521 4.478 10 10 10s10-4.479 10-10c0-5.522-4.478-10-10-10zm3 10h-2v3h-2v-3h-2v-2h2v-3h2v3h2v2z" />
                  </svg>
                  <div></div>
                </div>
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
                    placeholder="elishabere@gmail.com"
                    register={register}
                    defaultValue={'elishabere@gmail.com'}
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
      <div className="pl-4 flex flex-row w-6/12">
        <Button
          className={'mt-3 w-4/12 rounded'}
          type="outlined"
          isLoading={isLoading}
          color="tertiary"
          disabled={!isValid}
        // onClick={signIn}
        >
          <Typography
            type="help"
            color="tertiary"
            text={'Deactivate'}
          ></Typography>
        </Button>

      </div>
    </form>;
  }

  // console.log(isValid);
  return (
    <div className="bg-red flex min-w-0 flex-col xl:flex">
      <Breadcrumb
        items={[
          { label: 'Back to homepage', url: '#' },
          { label: 'Parent', url: '' },
          { label: 'Current' },
        ]}
      />



      <div className="m-10 rounded-2xl lg:min-w-0 lg:flex-1">
        <div className="py-0 px-4 sm:px-6 lg:px-8">
          {/* Start main area*/}

          <div className="flex" >
            <div className="p-6 dark:bg-gray-900 dark:text-gray-100 sm:p-12">
              <div
                className="flex flex-col space-y-4 md:flex-row md:space-y-0 "

              >
                <img
                  src="https://source.unsplash.com/75x75/?portrait"
                  alt=""
                  className="h-40 w-40 mr-6 flex-shrink-0 self-center rounded-full md:justify-self-start"
                />
                <div className='sm: pt-12'>
                  <p className='text-2xl'>test name</p>
                  <p>test name</p>
                  <p>test name</p>

                </div>


              </div>

            </div>
          </div>
          {/* End main area */}
        </div>

        <div className="m-10 mt-0 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-primary  border-l-8 border-2 border-primary">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}
            {personalEditInformationComponent}
            <h3 className='pb-10 border-b-4 border-dashed text-xl mb-14'> Personal information </h3>

            {/* End main area */}
          </div>
        </div>

        <div className="m-10 my-6 mt-16 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-secondary  border-l-8 border-2 border-secondary">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}
            <h3 className='pb-10 border-b-4 border-dashed text-xl mb-14'> Clients summary</h3>

            {/* End main area */}
          </div>
        </div>

        <div className='flex flex-row'>

          <div className="m-10  mb-12 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-errorMain  border-l-8 border-2 border-errorMain">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <div className="flex flex-row">
                <ArrowRightIcon className='w-20 h-20'></ArrowRightIcon>
                <h3 className='pb-10 border-b-4 border-dashed text-xl mb-14'> Urgent issues</h3>
              </div>
              {/* End main area */}
            </div>
          </div>
          <div className="m-10  mb-12 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-alertMain  border-l-8 border-2 border-alertMain">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <div className="flex flex-row">
                <h3 className='pb-10 border-b-4 border-dashed text-xl mb-14'> Other issues</h3>
              </div>


              {/* End main area */}
            </div>
          </div>
        </div>


        <div className="pl-4 flex flex-row w-6/12">
          <Button
            className={'mt-3 w-4/12 rounded'}
            type="outlined"
            isLoading={isLoading}
            color="tertiary"
            disabled={!isValid}
          // onClick={signIn}
          >
            <Typography
              type="help"
              color="tertiary"
              text={'Deactivate'}
            ></Typography>
          </Button>
          <Button
            className={'mt-3 w-4/12 rounded mx-6'}
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
      </div>
    </div>

  );
}

export default ViewUser;
