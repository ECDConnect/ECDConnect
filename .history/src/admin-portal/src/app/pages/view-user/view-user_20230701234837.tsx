import FormField from '../../components/form-field/form-field';
import {
  Alert,
  Button,
  DialogPosition,
  Typography,
  SA_CELL_REGEX,
  SA_ID_REGEX,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  ExclamationCircleIcon,
  TrashIcon,
  StarIcon,
  SaveIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/solid';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  initialPasswordValue,
  initialUserDetailsValues,
  NOTIFICATION,
  passwordSchema,
  PermissionEnum,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import AlertModal from '../../components/dialog-alert/dialog-alert';
import {
  DeleteUser,
  GetHealthCareWorkerByUserId,
  UpdateHealthCareWorker,
  GetHealthCareWorkerHighlights,
  GetTenantContext,
  GetUserById,
  ResetUserPassword,
  UpdateUser,
  UserModelInput,
  healthCareWorkerVisitStatus,
  SendInviteToApplication,
  GetHealthCareWorkerSummaryForPeriod,

} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '../../hooks/useUser';
import * as yup from 'yup';

import zxcvbn from 'zxcvbn-typescript';

const adminSchema = yup.object().shape({
  email: yup.string().email().required('email address is required'),
});

const chwSchema = yup.object().shape({
  idNumber: yup
    .string()
    .matches(SA_ID_REGEX, 'Id number is not valid')
    .required('ID number is required'),
  phoneNumber: yup
    .string()
    .matches(SA_CELL_REGEX, 'Phone number is not valid')
    .required('Cellphone number is required'),
});

export function ViewUser(props: any) {
  const [showPassword, setShowPassword] = useState(false);

  const [startDate, setStartDate] = useState<Date>(null);
  const [endDate, setEndDate] = useState<Date>(null);

  const history = useHistory();
  const [deleteUser] = useMutation(DeleteUser);
  const [updateUser, { loading }] = useMutation(UpdateUser);
  const [updateCHW, { loading: chwLoading }] = useMutation(
    UpdateHealthCareWorker
  );

  let userId = localStorage.getItem('selectedUser');
  const [resetUserPassword] = useMutation(ResetUserPassword);
  const { data } = useQuery(GetTenantContext, {
    fetchPolicy: 'cache-and-network',
  });

  const [getChwById, { data: chwData, refetch: refetchCHW }] = useLazyQuery(
    GetHealthCareWorkerByUserId,
    {
      variables: {
        userId: '',
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const [getUserById, { data: userData, refetch }] = useLazyQuery(GetUserById, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'cache-and-network',
  });

  // const [getUserById, { data: userData, refetch }] = useLazyQuery(GetUserById, {
  //   variables: {
  //     userId: '',
  //   },
  //   fetchPolicy: 'cache-and-network',
  // });


  const [getHealthCareWorkerSummaryForPeriod, { data: summaryData }] = useLazyQuery(GetHealthCareWorkerSummaryForPeriod, {
    variables: {
      "healthCareWorkerUserId": "ff911f4f-bfc8-4dd1-9124-ed51e468eb06",
      "startDate": "2020-06-23T08:17:52.518Z",
      "endDate": "2023-06-30T08:17:52.518Z"
    },
    fetchPolicy: 'cache-and-network',
  });


  useEffect(() => {
    getHealthCareWorkerSummaryForPeriod({
      variables: {
        // healthCareWorkerUserId: props.location.state.userId ?? userId,
        // "startDate":"2020-06-23T08:17:52.518Z",
        // "endDate":"2023-06-30T08:17:52.518Z"
        "healthCareWorkerUserId": "ff911f4f-bfc8-4dd1-9124-ed51e468eb06",
        "startDate": "2020-06-23T08:17:52.518Z",
        "endDate": "2023-06-30T08:17:52.518Z"
      }
    })
  }, [chwData, startDate, endDate]);

  useEffect(() => {
    props.location.state?.component !== 'chw' &&
      getUserById({
        variables: { userId: props.location.state.userId ?? userId },
      });

    props.location.state?.component === 'chw' &&
      getChwById({
        variables: { userId: props.location.state.userId ?? userId },
      });
    console.log(">>", userData)


  }, [userId]);

  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const dialog = useDialog();
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);

  const deactivateUser = async () => {
    dialog({
      // blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Deactivate Administrator"
          message={`${chwData?.GetHealthCareWorkerById.user?.firstName ??
            userData.userById.fullName
            } will lose their access to AppName immediately. Make sure you have communicated with them before deactivating them.`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            deleteUser({
              variables: {
                userId:
                  userData?.userById.id ?? chwData.GetHealthCareWorkerById.id,
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
  };
  const sendInvite = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Invite User"
          message={`You are about to send an invite to ${chwData?.GetHealthCareWorkerById?.user?.fullName ??
            userData?.userById?.fullName
            }`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            sendInviteToApplication({
              variables: {
                userId:
                  userData?.userById.id ?? chwData.GetHealthCareWorkerById.id,
              },
            }).then(() => {
              setNotification({
                title: 'Successfully Sent Invite!',
                variant: NOTIFICATION.SUCCESS,
              });
            });
          }}
        />
      ),
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [editActive, setEditActive] = useState<boolean>(false);
  const {
    register: userDetailRegister,
    setValue: userDetailSetValue,
    formState: userDetailFormState,
    getValues: userDetailGetValues,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(chwSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });

  const {
    register,
    setValue: adminDetailSetValue,
    formState: adminDetailFormState,
    getValues: adminDetailGetValues,
    handleSubmit: handleSubmitAdminDetails,
  } = useForm({
    resolver: yupResolver(adminSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });

  const {
    register: passwordRegister,
    formState: passwordFormState,
    getValues: passwordGetValues,
    watch,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onChange',
  });

  const { errors: passwordFormErrors, isValid: isPasswordValid } =
    passwordFormState;

  const { errors: detailFormErrors, isValid: isDetailValid } =
    userDetailFormState;

  const { errors: adminDetailFormErrors, isValid: isAdminDetailValid } =
    adminDetailFormState;

  const passwordForm = passwordGetValues();

  // SET EDIT FORMS
  useEffect(() => {
    if (
      (chwData?.GetHealthCareWorkerById.user) &&
      userDetailFormState
    ) {
      userDetailSetValue(
        'idNumber',
        chwData?.GetHealthCareWorkerById?.user.idNumber,
        {
          shouldValidate: true,
        }
      );

      userDetailSetValue(
        'phoneNumber',
        chwData?.GetHealthCareWorkerById?.user?.phoneNumber,
        {
          shouldValidate: true,
        }
      );
    } else if (
      userData &&
      adminDetailFormState
    ) {
      adminDetailSetValue(
        'email',
        userData?.userById?.email,
        {
          shouldValidate: true,
        }
      );

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chwData, userData]);



  const saveUser = async (passwordChange: boolean) => {
    const passwordForm = passwordGetValues();
    const userDetailForm = userDetailGetValues();
    const adminDataForm = adminDetailGetValues()

    const userInputModel: UserModelInput = {
      phoneNumber: userDetailForm?.phoneNumber,
      idNumber: userDetailForm?.idNumber,
      dateOfBirth: null,
      isSouthAfricanCitizen: null,
      verifiedByHomeAffairs: null,
    };

    const adminInputModel: UserModelInput = {
      email: adminDataForm?.email,
      dateOfBirth: null,
      isSouthAfricanCitizen: null,
      verifiedByHomeAffairs: null,
    };

    if (props.location.state.component === 'chw' && chwData) {
      await updateCHW({
        variables: {
          id: chwData?.GetHealthCareWorkerById?.user.id,
          input: { ...userInputModel },
        },
      });
      refetchCHW();
      setNotification({
        title: 'Successfully Updated CHW!',
        variant: NOTIFICATION.SUCCESS,
      });
    } else {
      await updateUser({
        variables: {
          id: userData?.userById.id,
          input: { ...adminInputModel },
        },
      });
      refetch()
      setNotification({
        title: 'Successfully Updated User!',
        variant: NOTIFICATION.SUCCESS,
      });
    }

    if (passwordChange) {
      await resetUserPassword({
        variables: {
          id: userData?.userById.id ?? chwData.GetHealthCareWorkerById.id,
          newPassword: passwordForm.password,
        },
      }).then(() => {
        setEditActive(!editActive);
        refetch();
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

    await saveUser(passwordChange)
  };

  //check password strength
  const password = watch('password');
  const passwordStrength = zxcvbn(password);
  const passwordScore = passwordStrength.score; // Assuming you have a variable to store the password strength score


  // chwData?.GetHealthCareWorkerById.user

  let isCHW = userData?.userById?.roles?.some(
    (role: any) => role.name === 'Health Care Worker'
  )


  console.log("chwData?.GetHealthCareWorkerById.user", isCHW);


  if (props.location.state?.component === 'chw' || isCHW) {
    return (
      <div className="bg-red flex min-w-0 flex-col xl:flex">
        <div className="justify-self col-end-3 ">
          <button
            onClick={() => history.goBack()}
            type="button"
            className="cursor text-secondary outline-none text-14 inline-flex w-full items-center border border-transparent px-4 py-2 font-medium "
          >
            <ArrowLeftIcon className="text-secondary mr-1 h-4 w-4">
              {' '}
            </ArrowLeftIcon>
            Back
            {/* <span className="text-black pl-2"> / View User</span> */}
          </button>
        </div>

        <div className="m-10 rounded-2xl lg:min-w-0 lg:flex-1">
          <div className="py-0 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}

            <div className="flex">
              <div className="p-6 dark:bg-gray-900 dark:text-gray-100 sm:p-12">
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 ">
                  <img
                    src="https://source.unsplash.com/75x75/?portrait"
                    alt=""
                    className="mr-6 h-40 w-40 flex-shrink-0 self-center rounded-full md:justify-self-start"
                  />
                  <div className="sm: pt-12">
                    <p className="text-3xl font-normal text-black ">
                      {chwData?.GetHealthCareWorkerById.user?.fullName}
                    </p>
                    <div className="flex flex-row pt-4">
                      {chwData &&
                        chwData?.GetHealthCareWorkerById?.user?.roles.map(
                          (i: any, index: number) => {
                            return (
                              <div
                                key={i.id}
                                className="bg-primary m-1 my-2 flex flex-row justify-center rounded-full py-1  px-3 text-xs text-white"
                              >
                                <p className="text-16">
                                  {' '}
                                  {i.name === 'Health Care Worker'
                                    ? 'CHW'
                                    : i.name}
                                </p>
                              </div>
                            );
                          }
                        )}
                    </div>
                    {/* <p>{userData?.firstName}</p> */}
                  </div>
                </div>
              </div>
            </div>
            {/* End main area */}
            {!chwData?.GetHealthCareWorkerById.user?.isActive && (
              <Alert
                className="mt-5 mb-3"
                message="This user has been deactivated and cannot access AppName."
                type="error"
              // customIcon={<SaveIcon></SaveIcon>}
              />
            )}
          </div>

          <div className="border-l-primary border-primary m-10 mt-0  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <h3 className="border-b-4 border-dashed pb-2 text-xl ">
                {' '}
                Personal information{' '}
              </h3>
              <form
                key={'formKey'}
                className="space-y-8 divide-y divide-gray-200"
              >
                {editActive ? (
                  <>
                    <div className="space-y-0">
                      {props.location.state?.component === 'chw' && (
                        <>
                          <p className="text-md mt-4 py-2">
                            Which kind of identification do you have for{' '}
                            {chwData?.GetHealthCareWorkerById.user?.firstName}?
                          </p>
                          <div className="flex flex-row">
                            {
                              <Button
                                className={' mr-0 w-4/12 rounded-md'}
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
                              </Button>
                            }
                            {
                              <Button
                                className={' ml-2 w-4/12 rounded-md'}
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
                              </Button>
                            }
                          </div>
                        </>
                      )}

                      <div className="grid grid-cols-1 ">
                        <>
                          <div className="my-4 w-6/12 sm:col-span-3">
                            <FormField
                              label={'ID number *'}
                              nameProp={'idNumber'}
                              register={userDetailRegister}
                              error={detailFormErrors.idNumber?.message}

                            />
                          </div>
                          <div className="my-4 w-6/12 sm:col-span-3">
                            <FormField
                              label={'Cellphone number *'}
                              nameProp={'phoneNumber'}
                              register={userDetailRegister}
                              error={detailFormErrors.phoneNumber?.message}

                            />
                          </div>
                        </>

                        <div className="my-4 w-6/12 sm:col-span-3">
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
                        <div className="-mx-1 flex w-6/12">
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

                    <Button
                      className={'mt-3 w-4/12 rounded-md '}
                      type="filled"
                      isLoading={chwLoading}
                      color="secondary"
                      disabled={!isDetailValid}
                      onClick={handleSubmit(onSave)}
                    >
                      <SaveIcon color="white" className="mr-6 h-6 w-6">
                        {' '}
                      </SaveIcon>
                      <Typography
                        type="help"
                        color="white"
                        text={'Save Changes'}
                      ></Typography>
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-row justify-start pt-4 text-current">
                    <p className="px-4 text-xl">
                      ID: {chwData?.GetHealthCareWorkerById.user?.idNumber}
                    </p>
                    <p className="px-4 text-xl">
                      {' '}
                      Cellphone:{' '}
                      {chwData?.GetHealthCareWorkerById.user?.phoneNumber}
                    </p>
                    {chwData?.GetHealthCareWorkerById.user?.whatsappNumber && <p className="px-4 text-xl">
                      WhatsApp:{' '}
                      {chwData?.GetHealthCareWorkerById.user?.whatsappNumber}
                    </p>}
                  </div>
                )}
              </form>
              {/* End main area */}
            </div>
            <div className="flex justify-end p-4">
              <button
                onClick={() => {
                  setEditActive(!editActive);
                }}
                id="dropdownHoverButton"
                className="bg-secondary focus:border-secondary w-1/ focus:outline-none focus:ring-secondary dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary inline-flex items-center rounded-lg py-2.5 px-12 text-center text-sm font-medium text-white hover:bg-gray-300 focus:ring-2"
                type="button"
              >
                {' '}
                {editActive ? 'Close' : 'Edit'}
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
            <div className="border-l-secondary border-secondary m-10 my-6 mt-4  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
              <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                {/* Start main area*/}
                <h3 className="mb-2 border-b-4 border-dashed pb-2 text-xl">
                  {' '}
                  Clients summary
                </h3>
                <div className="flex flex-row justify-evenly pt-4 text-current">
                  <p className="px-4 py-2  text-xl">
                    <span className="p-2  text-2xl">{summaryData?.healthCareWorkerSummaryForPeriod?.totalPregnantMoms}</span>pregnant moms
                  </p>
                  <p className="px-4 py-2  text-xl">
                    <span className="p-2  text-2xl">{summaryData?.healthCareWorkerSummaryForPeriod?.totalChildren}</span>children
                  </p>
                  <p className="px-4 py-2  text-xl">
                    <span className="p-2  text-2xl">{summaryData?.healthCareWorkerSummaryForPeriod?.totalClientsVisited}</span>clients visited
                  </p>
                  <p className="px-4 py-2  text-xl">
                    <span className="p-2  text-2xl">{summaryData?.healthCareWorkerSummaryForPeriod?.totalFoldersOpened}</span>folders opened
                  </p>
                </div>
                {/* End main area */}
              </div>
            </div>
          }
          {
            <div className="flex flex-row">
              <div className="border-l-errorMain  border-errorMain m-10 mb-12  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
                <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                  {/* Start main area*/}
                  <div className="flex flex-row border-b-4 border-dashed pb-0">
                    <ExclamationCircleIcon
                      className="h-12 w-12 pb-2"
                      style={{
                        color: '#ED1414',
                      }}
                    ></ExclamationCircleIcon>
                    <h3 className="mb-2  pb-0 pt-2 text-2xl"> Urgent issues</h3>
                  </div>
                  <div className="flex flex-col justify-evenly pt-4 text-current">
                    <p className="px-4py-2 text-xl">
                      <span className="text-errorMain p-2 text-2xl">
                        {summaryData?.healthCareWorkerSummaryForPeriod?.totalVisitsMissed}
                      </span>
                      Visits Missed
                    </p>

                    <p className="px-4py-2 text-xl">
                      <span className="text-errorMain p-2 text-2xl">{summaryData?.healthCareWorkerSummaryForPeriod?.totalPregnantMomsWithUrgentIssues
                      }</span>
                      pregnant moms have urgent issues
                    </p>

                    <p className="px-4py-2 text-xl">
                      <span className="text-errorMain p-2 text-2xl">{summaryData?.healthCareWorkerSummaryForPeriod?.totalCaregiversAndChildrenWithUrgentIssues}</span>
                      caregivers & children have urgent issues
                    </p>

                  </div>
                  {/* End main area */}
                </div>
              </div>
              <div className="border-l-alertMain  border-alertMain m-10 mb-12  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
                <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                  {/* Start main area*/}
                  <div className="flex flex-row border-b-4 border-dashed pb-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-12 w-12"
                      style={{
                        color: '#FF5C00',
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="mb-2  pb-0 pt-2 text-2xl"> Other issues</h3>
                  </div>
                  <div className="flex flex-col justify-evenly pt-4 text-current">
                    <p className="px-4py-2 text-xl">
                      <span className="text-alertMain p-2 text-2xl">
                        {
                          summaryData?.healthCareWorkerSummaryForPeriod?.totalVisitsOverdue
                        }
                      </span>
                      visits overdue
                    </p>
                    <p className="px-4py-2 text-xl">
                      <span className="text-alertMain p-2 text-2xl">
                        {
                          summaryData?.healthCareWorkerSummaryForPeriod?.totalPregnantMomsWithIssues
                        }
                      </span>
                      pregnant moms have other issues
                    </p>

                    <p className="px-4py-2 text-xl">
                      <span className="text-alertMain p-2 text-2xl">
                        {
                          summaryData?.healthCareWorkerSummaryForPeriod?.totalCaregiversAndChildrenWithIssues
                        }
                      </span>
                      caregivers & children have other issues
                    </p>
                  </div>

                  {/* End main area */}
                </div>
              </div>
            </div>
          }
          {
            <div className="border-l-successMain  border-successMain m-10 mb-10  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
              <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                {/* Start main area*/}
                <div className="flex flex-row border-b-4 border-dashed pb-0">
                  <StarIcon
                    className="successMain h-12 w-12 pb-2"
                    style={{
                      color: '#83BB26',
                    }}
                  ></StarIcon>
                  <h3 className="mb-2  pb-0 pt-2 text-2xl"> Highlights</h3>
                </div>
                <div className="flex flex-col justify-evenly pt-4 text-current">
                  <p className="px-4 py-2 text-lg">
                    <span className="text-successMain p-2 text-2xl">
                      {
                        summaryData?.healthCareWorkerSummaryForPeriod?.totalPregnantMoms

                      }
                    </span>
                    pregnant moms are doing well & have no issues
                  </p>
                  <p className="px-4 py-2 text-lg">
                    <span className="text-successMain p-2 text-2xl">
                      {
                        summaryData?.healthCareWorkerSummaryForPeriod?.totalChildren
                      }
                    </span>
                    children are doing well & have no issues
                  </p>


                </div>

                {/* End main area */}
              </div>
            </div>
          }
          <div className="flex w-full flex-row pl-4 justify-between">
            <div className="flex w-10/12 flex-row  pl-4">
              {
                hasPermission(PermissionEnum.delete_user) && <Button
                  className={'mt-3 w-4/12 rounded-md mr-2'}
                  type="outlined"
                  // isLoading={isLoading}
                  color="tertiary"
                  onClick={deactivateUser}

                >
                  <TrashIcon color="tertiary" className="mr-2 h-6 w-6">
                    {' '}
                  </TrashIcon>
                  <Typography
                    type="help"
                    color="tertiary"
                    text={'Deactivate User'}
                  ></Typography>
                </Button>
              }
              {
                <Button
                  className={'mt-3 w-4/12 rounded-md'}
                  type="filled"
                  // isLoading={isLoading}
                  color="secondary"
                  onClick={sendInvite}
                >
                  <PaperAirplaneIcon color="white" className="mr-6 h-6 w-6">
                    {' '}
                  </PaperAirplaneIcon>
                  <Typography
                    type="help"
                    color="white"
                    text={'Resend Invitation'}
                  ></Typography>
                </Button>
              }
            </div>

            <p className="mt-3 text-sm text-gray-500">
              User added to {data?.tenantContext.applicationName}:{' '}
              {chwData?.GetHealthCareWorkerById.user?.StartDate}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-red flex min-w-0 flex-col xl:flex">
        <div className="justify-self col-end-3 ">
          <button
            onClick={() => history.goBack()}
            type="button"
            className="cursor text-secondary outline-none text-14 inline-flex w-full items-center border border-transparent px-4 py-2 font-medium "
          >
            <ArrowLeftIcon className="text-secondary mr-1 h-4 w-4">
              {' '}
            </ArrowLeftIcon>
            Back
            {/* <span className="text-black pl-2"> / View User</span> */}
          </button>
        </div>

        <div className="m-10 rounded-2xl lg:min-w-0 lg:flex-1">
          <div className="py-0 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}

            <div className="flex">
              <div className="p-6 dark:bg-gray-900 dark:text-gray-100 sm:p-12">
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 ">
                  <img
                    src="https://source.unsplash.com/75x75/?portrait"
                    alt=""
                    className="mr-6 h-40 w-40 flex-shrink-0 self-center rounded-full md:justify-self-start"
                  />
                  <div className="sm: pt-12">
                    <p className="text-3xl font-normal text-black ">
                      {userData?.userById?.fullName}
                    </p>
                    <div className="flex flex-row pt-4">
                      {userData &&
                        userData?.userById?.roles?.map(
                          (i: any, index: number) => {
                            return (
                              <div
                                key={i.id}
                                className="bg-primary m-1 my-2 flex flex-row justify-center rounded-full py-1  px-3 text-xs text-white"
                              >
                                <p className="text-16">
                                  {' '}
                                  {i.name === 'Health Care Worker'
                                    ? 'CHW'
                                    : i.name}
                                </p>
                              </div>
                            );
                          }
                        )}
                    </div>
                    {/* <p>{userData?.firstName}</p> */}
                  </div>
                </div>
              </div>
            </div>
            {/* End main area */}
            {userData?.userById?.isActive && (
              <Alert
                className="mt-5 mb-3"
                message="This user has been deactivated and cannot access AppName."
                type="error"
              // customIcon={<SaveIcon></SaveIcon>}
              />
            )}
          </div>

          <div className="border-l-primary border-primary m-10 mt-0  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <h3 className="border-b-4 border-dashed pb-2 text-xl ">
                {' '}
                Personal information{' '}
              </h3>
              <form
                key={'formKey'}
                className="space-y-8 divide-y divide-gray-200"
              >
                {editActive ? (
                  <>
                    <div className="space-y-0">
                      <div className="grid grid-cols-1 ">
                        <div className="my-4 w-6/12 sm:col-span-3">
                          <FormField
                            label={'Email *'}
                            nameProp={'email'}
                            register={register}
                            error={adminDetailFormErrors.email?.message}
                          />
                        </div>

                        <div className="my-4 w-6/12 sm:col-span-3">
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
                        <div className="-mx-1 flex w-6/12">
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

                    <Button
                      className={'mt-3 w-4/12 rounded-md '}
                      type="filled"
                      isLoading={loading}
                      color="secondary"
                      disabled={!isAdminDetailValid}
                      onClick={handleSubmitAdminDetails(onSave)
                      }
                    >
                      <SaveIcon color="white" className="mr-6 h-6 w-6">
                        {' '}
                      </SaveIcon>
                      <Typography
                        type="help"
                        color="white"
                        text={'Save Changes'}
                      ></Typography>
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-row justify-start pt-4 text-current">
                    <p className="px-4 text-xl">
                      Email: {userData?.userById?.email}
                    </p>
                  </div>
                )}
              </form>
              {/* End main area */}
            </div>
            <div className="flex justify-end p-4">
              <button
                onClick={() => {
                  setEditActive(!editActive);

                }}
                id="dropdownHoverButton"
                className="bg-secondary focus:border-secondary w-1/ focus:outline-none focus:ring-secondary dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary inline-flex items-center rounded-lg py-2.5 px-12 text-center text-sm font-medium text-white hover:bg-gray-300 focus:ring-2"
                type="button"
              >
                {' '}
                {editActive ? 'Close' : 'Edit'}
              </button>
            </div>
          </div>

          <div className="flex w-full justify-between  pl-4">
            <div className="flex w-10/12 flex-row  pl-4">
              {
                hasPermission(PermissionEnum.delete_user) && <Button
                  className={'mt-3 w-4/12 rounded-md mr-2'}
                  type="outlined"
                  // isLoading={isLoading}
                  color="tertiary"
                  onClick={deactivateUser}

                >
                  <TrashIcon color="tertiary" className="mr-2 h-6 w-6">
                    {' '}
                  </TrashIcon>
                  <Typography
                    type="help"
                    color="tertiary"
                    text={'Deactivate User'}
                  ></Typography>
                </Button>
              }
              {
                <Button
                  className={'mt-3 w-4/12 rounded-md'}
                  type="filled"
                  // isLoading={isLoading}
                  color="secondary"
                  onClick={sendInvite}
                >
                  <PaperAirplaneIcon color="white" className="mr-6 h-6 w-6">
                    {' '}
                  </PaperAirplaneIcon>
                  <Typography
                    type="help"
                    color="white"
                    text={'Resend Invitation'}
                  ></Typography>
                </Button>
              }
            </div>

            <div className='w-2/12'>
              <p className="mt-3 text-sm text-gray-500 w-full">
                User added to {data?.tenantContext.applicationName}:{' '}
                {userData?.userById?.StartDate}
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default ViewUser;
