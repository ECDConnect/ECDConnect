import FormField from '../../components/form-field/form-field';
import { Button, DialogPosition, Dropdown, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { ArrowRightIcon, ExclamationCircleIcon, TrashIcon, StarIcon } from '@heroicons/react/solid';
import Breadcrumb from '../../components/breadcrumbs';
import HealthCareWorkerPanelEdit from '../users/sub-pages/health-care-worker/components/health-care-worker-panel-edit/hcw-panel-edit';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import {
  initialUserDetailsValues,
  NOTIFICATION,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
  UserDto,
  userSchema,
} from '@ecdlink/core';
import AlertModal from '../../components/dialog-alert/dialog-alert';
import { DeleteUser, GetUserById, UpdateUser } from '@ecdlink/graphql';
import UserDetailsForm from '../users/components/user-details-form/user-details-form';
import { yupResolver } from '@hookform/resolvers/yup';

export function ViewUser(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [deleteUser] = useMutation(DeleteUser);
  const [updateUser] = useMutation(UpdateUser);
  let userId = localStorage.getItem("selectedUser");


  const [getUserById, { data: userData }] = useLazyQuery(GetUserById, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    getUserById({ variables: { userId: userId } });
    console.log(">rowDta>>", userId, userData)

  }, [userId])

  const { register, getValues, formState, watch } = useForm({
    // resolver: yupResolver(editProfileSchema),
    // defaultValues: initialEditProfileValues,
    mode: 'onChange',
  });
  const { setNotification } = useNotifications();
  const dialog = useDialog();

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
                  // refetch();

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  //check password strength
  const password = watch('password');
  const formValues = getValues();
  // const passwordStrength = zxcvbn(password);
  // const passwordScore = passwordStrength.score; // Assuming you have a variable to store the password strength score
  const passwordScore = 2;

  const { errors, isValid } = formState;
  const [editActive, setEditActive] = useState<boolean>(false);
  const panel = usePanel();
  // const { data, refetch } = useQuery(GetAllTeamLead, {
  //   fetchPolicy: 'cache-and-network',
  // });


  const displayEditUserPanel = (user: any) => {
    panel({
      noPadding: true,
      title: '',
      presentationStyle: 'overFullScreen',
      render: (onSubmit) => (
        <HealthCareWorkerPanelEdit
          key={`userPanelEdit`}
          practitioner={user}
          closeDialog={(userCreated: boolean) => {
            onSubmit();

            if (userCreated) {
              // refetch();
            }
          }}
        />
      ),
    });
  };


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

  // console.log(isValid);
  return (
    <div className="bg-red flex min-w-0 flex-col xl:flex">
      <Breadcrumb
        items={[
          { label: props.component, url: '#' },
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
                  <p className='text-3xl font-normal '>{userData?.userById?.firstName + ' ' + userData?.userById?.surname}</p>

                  {userData?.userById.roles.map((i: any, index: number) => {
                    return <div
                      key={i.id}
                      className="bg-primary m-1 rounded-full py-1 my-2 px-3 text-xs text-white w-6/12 flex justify-center flex-row"
                    >
                      <p className='text-16'> {i.name}</p>
                    </div>
                  })}


                  <p>{userData?.firstName}</p>
                </div>


              </div>

            </div>
          </div>
          {/* End main area */}
        </div>

        <div className="m-10 mt-0 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-primary  border-l-8 border-2 border-primary">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}
            <h3 className='pb-2 border-b-4 border-dashed text-xl '> Personal information </h3>
            {
              editActive ? <UserDetailsForm
                formKey={`editUserDetails-${new Date().getTime()}-${userData?.userById?.id
                  }`}
                register={userDetailRegister}
                errors={userDetailFormErrors}
                setValue={userDetailSetValue}
                user={userData?.userById}
                control={control}
              /> :
                <div className='flex flex-row justify-start pt-4 text-current'>
                  <p className='text-xl px-4'>ID: {userData?.userById?.idNumber}</p>
                  <p className='text-xl px-4'> Cellphone: {userData?.userById?.phoneNumber}</p>
                  <p className='text-xl px-4'>WhatsApp: {userData?.userById?.phoneNumber}</p>
                </div>

            }
            {/* End main area */}
          </div>
          <div className='flex justify-end p-4'>
            <button onClick={()=>setEditActive(!editActive)} id="dropdownHoverButton"
              className="text-white bg-secondary hover:bg-gray-300 focus:border-secondary w-1/ text-center focus:ring-2 focus:outline-none focus:ring-secondary font-medium rounded-lg text-sm py-2.5 px-12 inline-flex items-center dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary"
              type="button">Edit

            </button>
          </div>

        </div>

        <div className=" flex justify-end">
          <div>
            <Dropdown
              fillType="filled"
              textColor="white"
              fillColor="secondary"
              placeholder="Filter "
              labelColor="white"
              // selectedValue={statusFilter}
              list={[
                { label: 'All', value: '' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              onChange={(item) => {
                // setStatusFilter(item);
              }}
              className='p-2'
            />
          </div>
        </div>

        <div className="m-10 my-6 mt-4 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-secondary  border-l-8 border-2 border-secondary">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}
            <h3 className='pb-2 border-b-4 border-dashed text-xl mb-2'> Clients summary</h3>
            <div className='flex flex-row justify-evenly pt-4 text-current'>
              <p className='text-xl px-4  py-2'><span className="text-3xl  p-2">4</span>pregnant moms</p>
              <p className='text-xl px-4  py-2'><span className="text-3xl  p-2">44</span>children</p>
              <p className='text-xl px-4  py-2'><span className="text-3xl  p-2">90</span>clients visited</p>
              <p className='text-xl px-4  py-2'><span className="text-3xl  p-2">24</span>folders opened</p>


            </div>
            {/* End main area */}
          </div>
        </div>

        <div className='flex flex-row'>

          <div className="m-10  mb-12 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-errorMain  border-l-8 border-2 border-errorMain">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <div className="flex flex-row border-b-4 border-dashed pb-0">
                <ExclamationCircleIcon className='w-12 h-12 pb-2' style={{
                  color: '#ED1414'
                }}></ExclamationCircleIcon>
                <h3 className='pb-0  text-2xl mb-2 pt-2'> Urgent issues</h3>

              </div>
              <div className='flex flex-col justify-evenly pt-4 text-current'>
                <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-errorMain">2</span>visits missed</p>
                <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-errorMain">2</span>pregnant moms have urgent issues</p>

                <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-errorMain">2</span>caregivers & children have urgent issues</p>
              </div>
              {/* End main area */}
            </div>
          </div>
          <div className="m-10  mb-12 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-alertMain  border-l-8 border-2 border-alertMain">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <div className="flex flex-row border-b-4 border-dashed pb-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12" style={{
                  color: '#FF5C00'
                }}>
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <h3 className='pb-0  text-2xl mb-2 pt-2'> Other issues</h3>
              </div>
              <div className='flex flex-col justify-evenly pt-4 text-current'>
                <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-alertMain">12</span>visits overdue</p>
                <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-alertMain">2</span>pregnant moms have other issues</p>
                <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-alertMain">3</span>caregivers & children have other issues</p>
              </div>

              {/* End main area */}
            </div>
          </div>


        </div>
        <div className="m-10  mb-12 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-successMain  border-l-8 border-2 border-successMain">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}
            <div className="flex flex-row border-b-4 border-dashed pb-0">
              < StarIcon className='w-12 h-12 pb-2 successMain' style={{
                color: '#83BB26'
              }}></StarIcon>
              <h3 className='pb-0  text-2xl mb-2 pt-2'> Highlights</h3>
            </div>
            <div className='flex flex-col justify-evenly pt-4 text-current'>
              <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-successMain">120</span>pregnant moms are doing well & have no issues</p>
              <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-successMain">2</span>children are doing well & have no issues</p>
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
            onClick={() => deleteUserAndRefresh}
          >
            <TrashIcon color='tertiary' className='w-6 h-6 mr-6'> </TrashIcon>
            <Typography
              type="help"
              color="tertiary"
              text={'Deactivate User'}
            ></Typography>
          </Button>

        </div>
      </div>
    </div>

  );
}

export default ViewUser;
