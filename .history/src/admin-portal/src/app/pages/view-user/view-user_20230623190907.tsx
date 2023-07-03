import FormField from '../../components/form-field/form-field';
import { Alert, Button, DialogPosition, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleIcon, TrashIcon, StarIcon, SaveIcon, ArrowLeftIcon } from '@heroicons/react/solid';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  initialPasswordValue,
  initialUserDetailsValues,
  NOTIFICATION,
  passwordSchema,
  PermissionEnum,
  useDialog,
  useNotifications,
  usePanel,
  UserDto,
} from '@ecdlink/core';
import AlertModal from '../../components/dialog-alert/dialog-alert';
import { DeleteUser, GetHealthCareWorkerHighlights, GetTenantContext, GetUserById, ResetUserPassword, UpdateUser, UserModelInput, healthCareWorkerVisitStatus } from '@ecdlink/graphql';
import UserDetailsForm from '../users/components/user-details-form/user-details-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '../../hooks/useUser';
import * as yup from 'yup';
import { SIX_DIGITS,SA_CELL_REGEX,SA_PASSPORT_REGEX,SA_ID_REGEX } from '@ecdlink/ui';

const userSchema = yup.object().shape({
  email: yup.string().email().required("Email is invalid"),
  idNumber: yup.string().matches(SA_ID_REGEX, 'Id number is not valid').required('ID number is required'),
  phoneNumber: yup.string().matches(SA_CELL_REGEX, 'Phone number is not valid').required('Cellphone number is required'),
});


export function ViewUser(props: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [deleteUser] = useMutation(DeleteUser);
  const [updateUser, { loading }] = useMutation(UpdateUser);
  let userId = localStorage.getItem("selectedUser");
  const [resetUserPassword] = useMutation(ResetUserPassword);
  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  console.log(">>>>", props.location.state?.component)

  const [getUserById, { data: userData, refetch }] = useLazyQuery(GetUserById, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'network-only',
  });
  const [getHealthCareWorkerHighlights, { data: healthCareWorkerHighlightsData }] = useLazyQuery(GetHealthCareWorkerHighlights, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'network-only',
  });

  const [getHealthCareWorkerVisitStatus, { data: healthCareWorkerVisitStatusData }] = useLazyQuery(healthCareWorkerVisitStatus, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'network-only',
  });


  useEffect(() => {
    getUserById({ variables: { userId: props.location.state.userId ?? userId } });
    getHealthCareWorkerHighlights({ variables: { userId: props.location.state.userId ?? userId } });
    getHealthCareWorkerVisitStatus({ variables: { userId: props.location.state.userId ?? userId } });
  }, [userId])

  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [editActive, setEditActive] = useState<boolean>(false);
  const {
    register: userDetailRegister,
    setValue: userDetailSetValue,
    formState: userDetailFormState,
    getValues: userDetailGetValues,
    control,
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
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onChange',
  });

  const { errors: passwordFormErrors, isValid: isPasswordValid } =
    passwordFormState;

  const { errors: detailFormErrors, isValid: isDetailValid } =
    userDetailFormState;

  const { errors: userDetailFormErrors, isValid: isUserDetailValid } =
    userDetailFormState;

  // SET EDIT FORMS
  useEffect(() => {
    if (userData?.userById && userDetailFormState) {
      userDetailSetValue('idNumber', userData?.userById?.idNumber, {
        shouldValidate: true,
      });

      userDetailSetValue('email', userData?.userById?.email, {
        shouldValidate: true,
      });
      userDetailSetValue('phoneNumber', userData?.userById?.phoneNumber, {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.userById]);

  const saveUser = async (passwordChange: boolean) => {
    const passwordForm = passwordGetValues();
    const userDetailForm = userDetailGetValues();

    const userInputModel: UserModelInput = {
      phoneNumber: userDetailForm.phoneNumber,
      idNumber: userDetailForm.idNumber,
      dateOfBirth: null,
      isSouthAfricanCitizen: null,
      verifiedByHomeAffairs: null
    };

    await updateUser({
      variables: {
        id: userData?.userById.id,
        input: { ...userInputModel },
      },
    });

    setNotification({
      title: 'Successfully Updated User!',
      variant: NOTIFICATION.SUCCESS,
    });

    if (passwordChange) {
      await resetUserPassword({
        variables: {
          id: userData?.userById.id,
          newPassword: passwordForm.password,
        },
      });
    }
  };

  const onSave = async () => {
    const passwordForm = passwordGetValues();
    let passwordChange = false;
    let internalIsPasswordValid = true;
    let isValid = isUserDetailValid;

    if (passwordForm.password.length > 0) {
      passwordChange = true;
      internalIsPasswordValid = isPasswordValid;
    }

    // if (isValid && internalIsPasswordValid) {

    await saveUser(passwordChange);
    // }
  };

  // console.log(isValid);
  return (
    <div className="bg-red flex min-w-0 flex-col xl:flex">
      <div className='justify-self col-end-3 '>
        <button
          onClick={() => history.goBack()}
          type="button"
          className="cursor text-secondary outline-none inline-flex w-full items-center border border-transparent px-4 py-2 text-14 font-medium "
        >
          <ArrowLeftIcon className="text-secondary h-4 w-4 mr-1"> </ArrowLeftIcon>
          Back
          {/* <span className="text-black pl-2"> / View User</span> */}
        </button>
      </div>



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
                  <div className="flex flex-row pt-4">
                    {userData && userData?.userById.roles.map((i: any, index: number) => {
                      return <div
                        key={i.id}
                        className="bg-primary m-1 rounded-full py-1 my-2 px-3 text-xs text-white  flex justify-center flex-row"
                      >
                        <p className='text-16'> {i.name}</p>
                      </div>
                    })}

                  </div>
                  <p>{userData?.firstName}</p>
                </div>


              </div>

            </div>
          </div>
          {/* End main area */}
          {userData?.userById?.isActive && <Alert
            className="mt-5 mb-3"
            message="This user has been deactivated and cannot access AppName."
            type="error"
          // customIcon={<SaveIcon></SaveIcon>}
          />}
        </div>

        <div className="m-10 mt-0 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-primary  border-l-8 border-2 border-primary">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}
            <h3 className='pb-2 border-b-4 border-dashed text-xl '> Personal information </h3>

            {
              editActive && props.location.state?.component === 'chw' ?
                <form key={"formKey"} className="space-y-8 divide-y divide-gray-200">
                  <div className="space-y-0">
                    <p className='text-md py-2 mt-4'>Which kind of identification do you have for {userData?.userById?.firstName}?</p>
                    <div className="flex flex-row">
                      {<Button
                        className={' w-4/12 rounded-md mr-0'}
                        type="filled"
                        isLoading={loading}
                        color="tertiary"
                        onClick={() => { }}
                      >
                        <Typography
                          type="help"
                          color="white"
                          text={'ID number'}
                        ></Typography>
                      </Button>}
                      {<Button
                        className={' w-4/12 rounded-md ml-2'}
                        type="filled"
                        isLoading={loading}
                        color="tertiaryAccent1"
                        onClick={() => { }}
                      >
                        <Typography
                          type="help"
                          color="tertiary"
                          text={'Passport number'}
                        ></Typography>
                      </Button>}
                    </div>

                    <div className="grid grid-cols-1 ">
                      <div className="my-4 sm:col-span-3 w-6/12">
                        <FormField
                          label={'ID number *'}
                          nameProp={'idNumber'}
                          register={userDetailRegister}
                          error={detailFormErrors.idNumber?.message}
                          defaultValue={userData?.userById?.idNumber}

                        />
                      </div>
                      <div className="my-4 sm:col-span-3 w-6/12">
                        <FormField
                          label={'Cellphone number *'}
                          nameProp={'phoneNumber'}
                          register={userDetailRegister}
                          error={detailFormErrors.phoneNumber?.message}
                          defaultValue={userData?.userById?.phoneNumber}
                        />
                      </div>
                      <div className="my-4 sm:col-span-3 w-6/12">
                        <FormField
                          label={'Password *'}
                          nameProp={'password'}
                          register={passwordRegister}
                          type="password"
                          error={passwordFormErrors.password?.message}
                          showPassword={showPassword}
                          togglePasswordVisibility={togglePasswordVisibility}
                        />
                      </div>
                    </div>
                  </div>
                  {<Button
                    className={'mt-3 w-4/12 rounded-md '}
                    type="filled"
                    isLoading={loading}
                    color="secondary"
                    disabled={!isUserDetailValid}
                    onClick={handleSubmit(onSave)}
                  >
                    <SaveIcon color='white' className='w-6 h-6 mr-6'> </SaveIcon>
                    <Typography
                      type="help"
                      color="white"
                      text={'Save Changes'}
                    ></Typography>
                  </Button>}
                </form> : (editActive && props.location.state?.component === 'administrators') ? <form key={"formKey"} className="space-y-8 divide-y divide-gray-200">
                  <div className="space-y-0">
                    <div className="grid grid-cols-1 ">

                      <div className="my-4 sm:col-span-3 w-6/12">
                        <FormField
                          label={'Email *'}
                          nameProp={'email'}
                          register={userDetailRegister}
                          error={detailFormErrors.email?.message}
                          defaultValue={userData?.email?.phoneNumber}
                        />
                      </div>
                      <div className="my-4 sm:col-span-3 w-6/12">
                        <FormField
                          label={'Password *'}
                          nameProp={'password'}
                          register={passwordRegister}
                          type="password"
                          error={passwordFormErrors.password?.message}
                          showPassword={showPassword}
                          togglePasswordVisibility={togglePasswordVisibility}
                        />
                      </div>
                    </div>
                  </div>
                  {<Button
                    className={'mt-3 w-4/12 rounded-md '}
                    type="filled"
                    isLoading={loading}
                    color="secondary"
                    disabled={!isUserDetailValid}
                    onClick={handleSubmit(onSave)}
                  >
                    <SaveIcon color='white' className='w-6 h-6 mr-6'> </SaveIcon>
                    <Typography
                      type="help"
                      color="white"
                      text={'Save Changes'}
                    ></Typography>
                  </Button>}
                </form> :
                  <div className='flex flex-row justify-start pt-4 text-current'>
                    <p className='text-xl px-4'>ID: {userData?.userById?.idNumber}</p>
                    <p className='text-xl px-4'> Cellphone: {userData?.userById?.phoneNumber}</p>
                    <p className='text-xl px-4'>WhatsApp: {userData?.userById?.phoneNumber}</p>
                  </div>

            }
            {/* End main area */}
          </div>
          <div className='flex justify-end p-4'>
            <button onClick={() => setEditActive(!editActive)} id="dropdownHoverButton"
              className="text-white bg-secondary hover:bg-gray-300 focus:border-secondary w-1/ text-center focus:ring-2 focus:outline-none focus:ring-secondary font-medium rounded-lg text-sm py-2.5 px-12 inline-flex items-center dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary"
              type="button"> {editActive ? "Done" : "Edit"}
            </button>
          </div>

        </div>

        {/* {
          data &&
          data.tenantContext &&
          data.tenantContext.applicationName === 'GrowGreat'
          && <div className=" flex justify-end">
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
          </div>} */}
        {
          data &&
          data.tenantContext &&
          data.tenantContext.applicationName === 'GrowGreat'
          &&
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
          </div>}
        {
          data &&
          data.tenantContext &&
          data.tenantContext.applicationName === 'GrowGreat'
          &&
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
                  <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-errorMain">{healthCareWorkerVisitStatusData?.healthCareWorkerVisitStatus.motherOverDueVisits}</span>Mother Over Due Visits</p>

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
                  <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-alertMain">{healthCareWorkerVisitStatusData?.healthCareWorkerVisitStatus.childDueVisits}</span>Child Due Visits</p>
                  <p className='text-xl px-4py-2'><span className="text-3xl p-2 text-alertMain">{healthCareWorkerVisitStatusData?.healthCareWorkerVisitStatus.motherDueVisits}</span>Mother Due Visits</p>
                </div>

                {/* End main area */}
              </div>
            </div>

          </div>}
        {
          data &&
          data.tenantContext &&
          data.tenantContext.applicationName === 'GrowGreat'
          &&
          <div className="m-10  mb-10 rounded-2xl bg-white  lg:min-w-0 lg:flex-1 border-l-successMain  border-l-8 border-2 border-successMain">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <div className="flex flex-row border-b-4 border-dashed pb-0">
                < StarIcon className='w-12 h-12 pb-2 successMain' style={{
                  color: '#83BB26'
                }}></StarIcon>
                <h3 className='pb-0  text-2xl mb-2 pt-2'> Highlights</h3>
              </div>
              <div className='flex flex-col justify-evenly pt-4 text-current'>
                <p className='text-lg px-4 py-2'><span className="text-3xl p-2 text-successMain">{healthCareWorkerHighlightsData?.healthCareWorkerHighlights.totalThisWeekNewClients}</span>This Week New Clients</p>
                <p className='text-lg px-4 py-2'><span className="text-3xl p-2 text-successMain">{healthCareWorkerHighlightsData?.healthCareWorkerHighlights.totalThisWeekGrowthMonitored}</span>This Week Growth Monitored</p>
                <p className='text-lg px-4 py-2'><span className="text-3xl p-2 text-successMain">{healthCareWorkerHighlightsData?.healthCareWorkerHighlights.totalThisWeekFamilyVisits}</span>This Week Family Visits</p>
                <p className='text-lg px-4 py-2'><span className="text-3xl p-2 text-successMain">{healthCareWorkerHighlightsData?.healthCareWorkerHighlights.totalLastWeekFamilyVisits}</span>Last Week Family Visits</p>
                <p className='text-lg px-4 py-2'><span className="text-3xl p-2 text-successMain">{healthCareWorkerHighlightsData?.healthCareWorkerHighlights.totalLastWeekGrowthMonitored}</span>Last Week Growth Monitored</p>
                <p className='text-lg px-4 py-2'><span className="text-3xl p-2 text-successMain">{healthCareWorkerHighlightsData?.healthCareWorkerHighlights.totalLastWeekNewClients}</span>Last Week New Client </p>
              </div>

              {/* End main area */}
            </div>
          </div>
        }
        <div className="pl-4 flex flex-row w-6/12">

          {<Button
            className={'mt-3 w-4/12 rounded-md'}
            type="outlined"
            // isLoading={isLoading}
            color="tertiary"
            onClick={
              () => {
                dialog({
                  // blocking: true,
                  position: DialogPosition.Middle,
                  render: (onSubmit: any, onCancel: any) => (
                    <AlertModal
                      title="Deactivate Administrator"
                      message={`${userData?.userById?.firstName} will lose their access to AppName immediately. Make sure you have communicated with them before deactivating them.`}
                      onCancel={onCancel}
                      onSubmit={() => {
                        onSubmit();
                        deleteUser({
                          variables: {
                            id: userId,
                          },
                        })
                          .then((response: any) => {
                            if (response.data.deleteUser) {
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
              }


            }
          >
            <TrashIcon color='tertiary' className='w-6 h-6 mr-6'> </TrashIcon>
            <Typography
              type="help"
              color="tertiary"
              text={'Deactivate User'}
            ></Typography>
          </Button>}

        </div>
      </div>
    </div >

  );
}

export default ViewUser;
