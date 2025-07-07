import FormField from '../../components/form-field/form-field';
import {
  Alert,
  Button,
  DialogPosition,
  Typography,
  SA_CELL_REGEX,
  SA_ID_REGEX,
  AlertType,
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
  RoleSystemNameEnum,
  useDialog,
  useNotifications,
} from '@ecdlink/core';
import AlertModal from '../../components/dialog-alert/dialog-alert';
import CustomDateRangePicker from '../../components/date-picker/index';
import {
  DeleteUser,
  GetUserById,
  ResetUserPassword,
  UpdateUser,
  UserModelInput,
  SendInviteToApplication,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '../../hooks/useUser';
import * as yup from 'yup';

import zxcvbn from 'zxcvbn-typescript';
import { PasswordInput } from '../../components/password-input/password-input';
import { subDays } from 'date-fns';
import { useTenant } from '../../hooks/useTenant';

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
  const tenant = useTenant();

  let userId = localStorage.getItem('selectedUser');
  const [resetUserPassword] = useMutation(ResetUserPassword);

  const [getUserById, { data: userData, refetch }] = useLazyQuery(GetUserById, {
    variables: {
      userId: '',
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    props.location.state?.component === 'administrators' &&
      getUserById({
        variables: { userId: props.location.state.userId ?? userId },
      });
  }, [userId]);

  const { hasPermission } = useUser();
  const { setNotification, clearNotification } = useNotifications();
  const dialog = useDialog();
  const [sendInviteToApplication] = useMutation(SendInviteToApplication);

  const deactivateUser = async () => {
    dialog({
      // blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Deactivate User"
          btnText={['Yes, Deactivate User', 'No, Cancel']}
          message={`${userData.userById.fullName} will lose their access to ${tenant.tenant?.applicationName} App immediately. Make sure you have communicated with them before deactivating them.`}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            deleteUser({
              variables: {
                id: userData?.userById?.id,
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
    (role: any) =>
      role.systemName === RoleSystemNameEnum.Administrator ||
      role.systemName === RoleSystemNameEnum.SuperAdmin
  );

  const sendInvite = async () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <AlertModal
          title="Invite User"
          message={`You are about to send an invite to ${userData?.userById?.fullName}`}
          btnText={['Yes, Resend Invitation', 'No, Cancel']}
          onCancel={onCancel}
          onSubmit={() => {
            onSubmit();
            sendInviteToApplication({
              variables: {
                userId: userData?.userById?.id,
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

  const { errors: adminDetailFormErrors, isValid: isAdminDetailValid } =
    adminDetailFormState;

  const passwordForm = passwordGetValues();

  // SET EDIT FORMS
  useEffect(() => {
    adminDetailSetValue('email', userData?.userById?.email, {
      shouldValidate: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const saveUser = async (passwordChange: boolean) => {
    const passwordForm = passwordGetValues();
    const adminDataForm = adminDetailGetValues();

    const userInputModel: UserModelInput = {
      idNumber: adminDataForm?.idNumber,
      phoneNumber: adminDataForm?.phoneNumber,
      email: adminDataForm?.email,
      userName: adminDataForm?.idNumber,
    };

    await updateUser({
      variables: {
        id: userData?.userById?.id,
        input: userInputModel,
      },
    })
      .then(() => {
        if (userData?.phoneNumber) refetch();

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
          id: userData?.userById?.id,
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
          <span className="px-1 text-gray-400"> / View User</span>
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
                  dataUrl={userData?.userById?.profileImageUrl}
                  onPressed={() => {}}
                  hasConsent
                  size="header"
                />

                <div className="sm: pt-4 pl-8">
                  <p className="text-3xl font-normal text-black ">
                    {userData?.userById?.fullName}
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
                  </div>
                  {/* <p>{userData?.firstName}</p> */}
                </div>
              </div>
            </div>
          </div>
          {/* End main area */}
          {!userData && (
            <Alert
              className="mt-5 mb-3"
              message={`This user has been deactivated and cannot access ${tenant.tenant?.applicationName} App`}
              type="error"
              // customIcon={<SaveIcon></SaveIcon>}
            />
          )}
          {userData && !userData?.userById?.isActive && (
            <Alert
              className="mt-5 mb-3"
              message={`This user has been deactivated and cannot access ${tenant.tenant?.applicationName} App`}
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
              className="space-y-3 divide-y divide-gray-200"
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
            {hasPermission(PermissionEnum.delete_user) && (
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

          <div className="w-2/12">
            <p className="mt-3 w-full text-sm text-gray-600">
              User added to {tenant.tenant?.applicationName} App :{' '}
              {formatDate(userData?.userById?.insertedDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;
