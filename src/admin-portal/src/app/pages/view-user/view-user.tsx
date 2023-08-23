import FormField from '../../components/form-field/form-field';
import {
  Alert,
  Button,
  DialogPosition,
  Typography,
  SA_CELL_REGEX,
  SA_ID_REGEX,
  Dropdown,
  AlertType,
  Avatar,
  ProfileAvatar,
  classNames,
} from '@ecdlink/ui';
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  ExclamationCircleIcon,
  TrashIcon,
  StarIcon,
  SaveIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon,
  ThumbUpIcon,
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
import CustomDateRangePicker from '../../components/date-picker/index';
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
  GetAllTeamLead,
  GetTeamLead,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '../../hooks/useUser';
import * as yup from 'yup';

import zxcvbn from 'zxcvbn-typescript';
import { PasswordInput } from '../../components/password-input/password-input';
import { startOfMonth, subDays } from 'date-fns';

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

const adminSchema = yup.object().shape({
  email: yup.string().email().required('email address is required'),
});
const formatDate = (value: string | number | Date) => {
  try {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  } catch (e) {
    return 'N/A';
  }
};
const showNotification = (
  message: string,
  type: AlertType,
  icon?: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return (
    <Alert
      className="mx-20 mt-5 mb-3 rounded-md"
      message={message}
      type={type}
      customIcon={icon}
    />
  );
};

export function ViewUser(props: any) {
  const currentDate = new Date();
  const startDate = subDays(currentDate, 30);
  const endDate = currentDate;

  const [successNotification, setSucessNotification] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<Date[]>([
    startDate,
    endDate,
  ]);

  const handleDateChange = (range: Date[]) => {
    setSelectedRange(range);
  };
  const history = useHistory();
  const [deleteUser] = useMutation(DeleteUser);
  const [updateUser, { loading }] = useMutation(UpdateUser);

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
  const [getAllTeamLead, { data: teamLeadData }] = useLazyQuery(GetTeamLead, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getUserById, { data: userData, refetch }] = useLazyQuery(GetUserById, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getHealthCareWorkerSummaryForPeriod, { data: summaryData }] =
    useLazyQuery(GetHealthCareWorkerSummaryForPeriod, {
      variables: {
        userId: '',
        healthCareWorkerId: '',
        startDate: '',
        endDate: '',
      },
      fetchPolicy: 'cache-and-network',
    });

  useEffect(() => {
    getHealthCareWorkerSummaryForPeriod({
      variables: {
        userId: props.location.state.userId ?? userId,
        healthCareWorkerId:
          chwData?.GetHealthCareWorkerById?.user?.id ??
          props.location.state.userId ??
          userId,
        startDate: selectedRange[0]?.toISOString() ?? startDate.toISOString(),
        endDate: selectedRange[1]?.toISOString() ?? endDate.toISOString(),
      },
    });
  }, [selectedRange]);

  useEffect(() => {
    props.location.state?.component === 'administrators' &&
      getUserById({
        variables: { userId: props.location.state.userId ?? userId },
      });

    props.location.state?.component === 'chw' &&
      getChwById({
        variables: { userId: props.location.state.userId ?? userId },
      });

    props.location.state?.component === 'team-leads' &&
      getAllTeamLead({
        variables: { userId: props.location.state.userId ?? userId },
      });
  }, [userId]);

  const { hasPermission } = useUser();
  const { setNotification, clearNotification } = useNotifications();
  const dialog = useDialog();
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);

  const isNotLockedOut = (user) => {
    if (!user) return true;
    return !user?.lockoutEnd || user?.lockoutEnd < new Date();
  };

  const deactivateUser = async () => {
    dialog({
      // blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Deactivate User"
          btnText={['Yes, Deactivate User', 'No, Cancel']}
          message={`${
            chwData?.GetHealthCareWorkerById?.user?.firstName ??
            userData.userById.fullName
          } will lose their access to ${
            data?.tenantContext.applicationName
          } App immediately. Make sure you have communicated with them before deactivating them.`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            deleteUser({
              variables: {
                id:
                  userData?.userById?.id ?? chwData.GetHealthCareWorkerById.id,
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
                setNotification({
                  title: 'Failed to Delete User!',
                  variant: NOTIFICATION.ERROR,
                });
              });
          }}
        />
      ),
    });
  };

  let isAdminUser = userData?.userById?.roles?.some(
    (role: any) => role.name === 'Administrator'
  );

  const sendInvite = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Invite User"
          message={`You are about to send an invite to ${
            chwData?.GetHealthCareWorkerById?.user?.fullName ??
            userData?.userById?.fullName
          }`}
          btnText={['Yes, Resend Invitation', 'No, Cancel']}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            sendInviteToApplication({
              variables: {
                userId:
                  userData?.userById?.id ??
                  chwData.GetHealthCareWorkerById.user.id,
                inviteToPortal: isAdminUser,
              },
            })
              .then(() => {
                refetch();
                setNotification({
                  title: 'Successfully Sent Invite!',
                  variant: NOTIFICATION.SUCCESS,
                });
              })
              .catch((err) => {
                setNotification({
                  title: 'Failed to Send Invite!',
                  variant: NOTIFICATION.ERROR,
                });
              });
          }}
        />
      ),
    });
  };

  const [editActive, setEditActive] = useState<boolean>(false);

  let isCHW = userData?.userById?.roles?.some(
    (role: any) => role.name === 'Community Health Worker'
  );

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
    register: registerCHW,
    setValue: chwDetailSetValue,
    formState: chwDetailFormState,
    getValues: chwDetailGetValues,
    handleSubmit: handleSubmitChwDetails,
  } = useForm({
    resolver: yupResolver(chwSchema),
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

  const { errors: adminDetailFormErrors, isValid: isAdminDetailValid } =
    adminDetailFormState;

  const { errors: chwDetailFormErrors, isValid: isChwDetailValid } =
    chwDetailFormState;
  const passwordForm = passwordGetValues();

  // SET EDIT FORMS
  useEffect(() => {
    adminDetailSetValue(
      'email',
      userData?.userById?.email || chwData?.GetHealthCareWorkerById?.user.email,
      {
        shouldValidate: true,
      }
    );

    chwDetailSetValue(
      'idNumber',
      userData?.userById?.idNumber ||
        chwData?.GetHealthCareWorkerById?.user.idNumber,
      {
        shouldValidate: true,
      }
    );

    chwDetailSetValue(
      'phoneNumber',
      userData?.userById?.phoneNumber ||
        chwData?.GetHealthCareWorkerById?.user.phoneNumber,
      {
        shouldValidate: true,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, chwData]);

  const saveUser = async (passwordChange: boolean) => {
    const passwordForm = passwordGetValues();
    const adminDataForm = adminDetailGetValues();
    const chwDataForm = chwDetailGetValues();

    const userInputModel: UserModelInput = {
      idNumber: chwDataForm?.idNumber,
      phoneNumber: chwDataForm?.phoneNumber,
      email: adminDataForm?.email,
    };

    await updateUser({
      variables: {
        id:
          userData?.userById?.id ??
          chwData?.GetHealthCareWorkerById?.user.id ??
          teamLeadData?.user.id,
        input: userInputModel,
      },
    })
      .then(() => {
        if (userData?.phoneNumber) refetch();

        if (chwData?.GetHealthCareWorkerById?.user?.phoneNumber) {
          console.log('refetchCHW');
          refetchCHW();
        }

        setNotification({
          title: 'Successfully Updated User!',
          variant: NOTIFICATION.SUCCESS,
        });
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to update User',
          variant: NOTIFICATION.ERROR,
        });
      });

    if (passwordChange) {
      await resetUserPassword({
        variables: {
          id:
            userData?.userById?.id ?? chwData?.GetHealthCareWorkerById?.user.id,
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
    if (passwordForm.password.length > 0) {
      passwordChange = true;
    }
    await saveUser(passwordChange);
  };

  //check password strength
  const password = watch('password');
  const passwordStrength = zxcvbn(password);
  const passwordScore = passwordStrength.score; // Assuming you have a variable to store the password strength score

  return (
    <div className="bg-red flex min-w-0 flex-col xl:flex">
      <div className="justify-self col-end-3 ">
        <button
          onClick={() => history.goBack()}
          type="button"
          className="text-secondary outline-none text-14 inline-flex w-full cursor-pointer items-center border border-transparent px-4 py-2 font-medium "
        >
          <ArrowLeftIcon className="text-secondary mr-1 h-4 w-4">
            {' '}
          </ArrowLeftIcon>
          Back
          <span className="px-1 text-gray-400">
            {' '}
            / View {isCHW ? 'CHW' : 'User'}
          </span>
        </button>
      </div>
      {successNotification &&
        showNotification(
          'User Added Successfully! ',
          'success',
          <ThumbUpIcon className="h-10 w-10"></ThumbUpIcon>
        )}

      <div className="m-10 rounded-2xl lg:min-w-0 lg:flex-1">
        <div className="py-0 px-4 sm:px-6 lg:px-8">
          {/* Start main area*/}

          <div className="flex">
            <div className="p-6 dark:bg-gray-900 dark:text-gray-100 sm:p-12">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 ">
                <ProfileAvatar
                  canChangeImage={false}
                  dataUrl={
                    userData?.userById?.profileImageUrl ||
                    chwData?.GetHealthCareWorkerById?.user?.profileImageUrl
                  }
                  onPressed={() => {}}
                  hasConsent
                  size="header"
                />

                <div className="sm: pt-4 pl-8">
                  <p className="text-3xl font-normal text-black ">
                    {userData?.userById?.fullName ??
                      chwData?.GetHealthCareWorkerById?.user?.fullName}
                  </p>
                  <div className="flex flex-row pt-2">
                    {userData &&
                      userData?.userById?.roles?.map(
                        (i: any, index: number) => {
                          return (
                            <div
                              key={i.id}
                              className={classNames(
                                'bg-tertiary',
                                ' m-1 my-2 flex flex-row justify-center rounded-full py-1  px-3 text-xs text-white'
                              )}
                            >
                              <p className="text-16"> {i.name}</p>
                            </div>
                          );
                        }
                      )}
                    {chwData &&
                      chwData?.GetHealthCareWorkerById?.user?.roles?.map(
                        (i: any, index: number) => {
                          return (
                            <div
                              key={i.id}
                              className={classNames(
                                i.name === 'Community Health Worker'
                                  ? 'bg-primary'
                                  : 'bg-tertiary',
                                ' m-1 my-2 flex flex-row justify-center rounded-full py-1  px-3 text-xs text-white'
                              )}
                            >
                              <p className="text-16">
                                {' '}
                                {i.name === 'Community Health Worker'
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
          {!isNotLockedOut(
            userData?.userById ?? chwData?.GetHealthCareWorkerById?.user
          ) && (
            <Alert
              className="mt-5 mb-3"
              message={`This user has been deactivated and cannot access ${data?.tenantContext.applicationName} App`}
              type="error"
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
              className="space-y-3 divide-y divide-gray-200"
            >
              {editActive ? (
                <>
                  <div className="space-y-0">
                    <div className="grid grid-cols-1 ">
                      {isCHW || props.location.state?.component === 'chw' ? (
                        <>
                          <div className="my-4 w-6/12 sm:col-span-3">
                            <FormField
                              label={'ID number *'}
                              nameProp={'idNumber'}
                              register={registerCHW}
                              error={chwDetailFormErrors.idNumber?.message}
                            />
                          </div>
                          <div className="my-4 w-6/12 sm:col-span-3">
                            <FormField
                              label={'Cellphone number *'}
                              nameProp={'phoneNumber'}
                              register={registerCHW}
                              error={chwDetailFormErrors.phoneNumber?.message}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="my-4 w-6/12 sm:col-span-3">
                          <FormField
                            label={'Email *'}
                            nameProp={'email'}
                            register={register}
                            error={adminDetailFormErrors.email?.message}
                          />
                        </div>
                      )}

                      <div className="my-0 w-6/12 sm:col-span-2">
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
                    </div>
                  </div>
                  {isCHW || props.location.state?.component === 'chw' ? (
                    <Button
                      className={' w-4/12 rounded-md '}
                      type="filled"
                      isLoading={loading}
                      color="secondary"
                      disabled={!isChwDetailValid}
                      onClick={handleSubmitChwDetails(onSave)}
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
                  ) : (
                    <Button
                      className={' w-4/12 rounded-md '}
                      type="filled"
                      isLoading={loading}
                      color="secondary"
                      disabled={!isAdminDetailValid}
                      onClick={handleSubmitAdminDetails(onSave)}
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
                  )}
                </>
              ) : isCHW || props.location.state?.component === 'chw' ? (
                <div className="flex flex-row justify-start pt-4 text-current">
                  <p className="px-4 text-xl">
                    ID:{' '}
                    {userData?.userById?.idNumber ||
                      chwData?.GetHealthCareWorkerById?.user?.idNumber}
                  </p>
                  <p className="px-4 text-xl">
                    {' '}
                    Cellphone:{' '}
                    {userData?.userById?.phoneNumber ||
                      chwData?.GetHealthCareWorkerById?.user?.phoneNumber}
                  </p>
                  {userData?.userById?.whatsappNumber && (
                    <p className="px-4 text-xl">
                      WhatsApp:{' '}
                      {userData?.userById?.whatsappNumber ||
                        chwData?.GetHealthCareWorkerById?.user?.whatsappNumber}
                    </p>
                  )}
                </div>
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
            {isNotLockedOut(
              userData?.userById ?? chwData?.GetHealthCareWorkerById?.user
            ) && (
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
            )}
          </div>
        </div>

        {(isCHW || props.location.state?.component === 'chw') &&
          data &&
          data.tenantContext &&
          data.tenantContext.applicationName === 'GrowGreat' && (
            <div className=" flex justify-end">
              <div>
                <CustomDateRangePicker
                  handleDateChange={handleDateChange}
                  selectedRange={selectedRange}
                />
              </div>
            </div>
          )}
        {(isCHW || props.location.state?.component === 'chw') && (
          <div className="border-l-secondary border-secondary m-10 my-6 mt-4  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <h3 className="mb-2 border-b-4 border-dashed pb-2 text-xl">
                {' '}
                Clients summary
              </h3>
              <div className="flex flex-row justify-evenly pt-4 text-current">
                <p className="px-4 py-2  text-xl">
                  <span className="p-2  text-2xl">
                    {
                      summaryData?.healthCareWorkerSummaryForPeriod
                        ?.totalPregnantMoms
                    }
                  </span>
                  pregnant moms
                </p>
                <p className="px-4 py-2  text-xl">
                  <span className="p-2  text-2xl">
                    {
                      summaryData?.healthCareWorkerSummaryForPeriod
                        ?.totalChildren
                    }
                  </span>
                  children
                </p>
                <p className="px-4 py-2  text-xl">
                  <span className="p-2  text-2xl">
                    {
                      summaryData?.healthCareWorkerSummaryForPeriod
                        ?.totalClientsVisited
                    }
                  </span>
                  clients visited
                </p>
                <p className="px-4 py-2  text-xl">
                  <span className="p-2  text-2xl">
                    {
                      summaryData?.healthCareWorkerSummaryForPeriod
                        ?.totalFoldersOpened
                    }
                  </span>
                  folders opened
                </p>
              </div>
              {/* End main area */}
            </div>
          </div>
        )}
        {(isCHW || props.location.state?.component === 'chw') && (
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
                      {
                        summaryData?.healthCareWorkerSummaryForPeriod
                          ?.totalVisitsMissed
                      }
                    </span>
                    Visits Missed
                  </p>

                  <p className="px-4py-2 text-xl">
                    <span className="text-errorMain p-2 text-2xl">
                      {
                        summaryData?.healthCareWorkerSummaryForPeriod
                          ?.totalPregnantMomsWithUrgentIssues
                      }
                    </span>
                    pregnant moms have urgent issues
                  </p>

                  <p className="px-4py-2 text-xl">
                    <span className="text-errorMain p-2 text-2xl">
                      {
                        summaryData?.healthCareWorkerSummaryForPeriod
                          ?.totalCaregiversAndChildrenWithUrgentIssues
                      }
                    </span>
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
                        summaryData?.healthCareWorkerSummaryForPeriod
                          ?.totalVisitsOverdue
                      }
                    </span>
                    visits overdue
                  </p>
                  <p className="px-4py-2 text-xl">
                    <span className="text-alertMain p-2 text-2xl">
                      {
                        summaryData?.healthCareWorkerSummaryForPeriod
                          ?.totalPregnantMomsWithIssues
                      }
                    </span>
                    pregnant moms have other issues
                  </p>

                  <p className="px-4py-2 text-xl">
                    <span className="text-alertMain p-2 text-2xl">
                      {
                        summaryData?.healthCareWorkerSummaryForPeriod
                          ?.totalCaregiversAndChildrenWithIssues
                      }
                    </span>
                    caregivers & children have other issues
                  </p>
                </div>

                {/* End main area */}
              </div>
            </div>
          </div>
        )}
        {(isCHW || props.location.state?.component === 'chw') && (
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
                      summaryData?.healthCareWorkerSummaryForPeriod
                        ?.totalPregnantMomsWithNoIssues
                    }
                  </span>
                  pregnant moms are doing well & have no issues
                </p>
                <p className="px-4 py-2 text-lg">
                  <span className="text-successMain p-2 text-2xl">
                    {
                      summaryData?.healthCareWorkerSummaryForPeriod
                        ?.totalChildrenWithNoIssues
                    }
                  </span>
                  children are doing well & have no issues
                </p>
              </div>

              {/* End main area */}
            </div>
          </div>
        )}

        <div className="flex w-full justify-between  pl-4">
          <div className="flex w-10/12 flex-row  pl-4">
            {hasPermission(PermissionEnum.delete_user) &&
              isNotLockedOut(
                userData?.userById ?? chwData?.GetHealthCareWorkerById?.user
              ) && (
                <Button
                  className={'mt-3 mr-2 w-4/12 rounded-md'}
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
              )}
            {isNotLockedOut(
              userData?.userById ?? chwData?.GetHealthCareWorkerById?.user
            ) && (
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
            )}
          </div>

          <div className="w-2/12">
            <p className="mt-3 w-full text-sm text-gray-600">
              User added to {data?.tenantContext.applicationName} App :{' '}
              {formatDate(
                chwData?.GetHealthCareWorkerById?.insertedDate ||
                  userData?.userById?.insertedDate
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;
