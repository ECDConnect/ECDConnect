import {
  ActionModal,
  Alert,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  Dropdown,
  SA_CELL_REGEX,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
  Typography,
} from '@ecdlink/ui';
import FormField from '../../../../components/form-field/form-field';
import { UsersRouteRedirectTypeEnum, idTypeEnum } from '../../view-user.types';
import { SaveIcon } from '@heroicons/react/solid';
import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  GetAllPortalCoaches,
  GetAllPortalPractitioners,
  PractitionerInput,
  ResetUserPassword,
  UpdatePractitioner,
  UpdateUser,
  UserModelInput,
} from '@ecdlink/graphql';
import {
  NOTIFICATION,
  PractitionerDto,
  UserDto,
  initialPasswordValue,
  initialUserDetailsValues,
  passwordSchema,
  useNotifications,
} from '@ecdlink/core';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUserRole } from '../../../../hooks/useUserRole';
import { cloneDeep } from '@apollo/client/utilities';
import { useTenant } from '../../../../hooks/useTenant';

export interface PersonalInfoProps {
  userData: UserDto;
  isRegistered: boolean;
  component: string;
  clinicId: string;
  refetchUserData: () => void;
  isAdministrator?: boolean;
  userTypeToEdit: string;
  isFromAdministratorTable?: boolean;
  practitioner?: PractitionerDto;
  refetchGetPractitionerByUserId?: () => void;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  userData,
  isRegistered,
  component,
  clinicId,
  practitioner,
  refetchUserData,
  isAdministrator,
  userTypeToEdit,
  isFromAdministratorTable,
  refetchGetPractitionerByUserId,
}) => {
  const [updateUser, { loading }] = useMutation(UpdateUser);
  const [updatePractitioner, { loading: loadingUpdatePractitioner }] =
    useMutation(UpdatePractitioner);
  const [resetUserPassword] = useMutation(ResetUserPassword);
  const { setNotification } = useNotifications();
  const [editActive, setEditActive] = useState<boolean>(false);
  const [coach, setCoach] = useState('');
  const [coaches, setCoaches] = useState([]);
  const [hasCoachChange, setHasCoachChange] = useState(false);
  const [practitionerDetailsHasChanged, setPractitionerDetailsHasChanged] =
    useState(false);
  const [idType, setIdType] = useState<string>('');
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;

  const chwSchemaIdNr = yup.object().shape({
    idNumber: yup
      .string()
      .matches(SA_ID_REGEX, 'Id number is not valid')
      .required('ID Number is Required'),
    phoneNumber: yup
      .string()
      .matches(SA_CELL_REGEX, 'Phone number is not valid')
      .required('Cellphone number is required'),
    firstName: yup.string().required('First name is required'),
    surname: yup.string().required('Surname is required'),
  });

  const chwSchemaPassport = yup.object().shape({
    idNumber: yup
      .string()
      .matches(SA_PASSPORT_REGEX, 'Passport is not valid')
      .required('Passport is Required'),
    phoneNumber: yup
      .string()
      .matches(SA_CELL_REGEX, 'Phone number is not valid')
      .required('Cellphone number is required'),
  });

  const adminSchema = yup.object().shape({
    email: yup.string().email().required('email address is required'),
  });

  const coachQueryVariables = useMemo(
    () => ({
      search: '',
      connectUsageSearch: [],
      pagingInput: {
        pageNumber: 1,
        pageSize: null,
      },
      order: [
        {
          insertedDate: 'DESC',
        },
      ],
    }),
    []
  );

  const { data: coachData } = useQuery(GetAllPortalCoaches, {
    variables: coachQueryVariables,
    fetchPolicy: 'network-only',
  });

  const practitionerCoach = coachData?.allPortalCoaches?.find(
    (item) => item?.id === practitioner?.coachHierarchy
  )?.id;

  const queryVariables = useMemo(
    () => ({
      search: '',
      provinceSearch: [],
      connectUsageSearch: [],
      practitionerTypeSearch: [],
      pagingInput: {
        pageNumber: 1,
        pageSize: null,
      },
      order: [
        {
          insertedDate: 'DESC',
        },
      ],
    }),
    []
  );

  const [fetchPractitionersData, { data: practitionersData }] = useLazyQuery(
    GetAllPortalPractitioners,
    {
      variables: queryVariables,
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (component === UsersRouteRedirectTypeEnum?.practitioner) {
      fetchPractitionersData();
    }
  }, [component, fetchPractitionersData]);

  const practitionerPrincipal = useMemo(
    () =>
      practitionersData?.allPortalPractitioners?.find(
        (item) => item?.userId === practitioner?.principalHierarchy
      ),
    [
      practitioner?.principalHierarchy,
      practitionersData?.allPortalPractitioners,
    ]
  );

  useEffect(() => {
    if (coachData?.allPortalCoaches?.length > 0) {
      setCoaches(
        coachData?.allPortalCoaches?.map((item) => {
          return {
            value: item?.id,
            label: item?.user?.fullName || item?.user?.firstName,
          };
        })
      );
    }
  }, [coachData?.allPortalCoaches]);

  const {
    register: registerCHW,
    setValue: chwDetailSetValue,
    formState: chwDetailFormState,
    getValues: chwDetailGetValues,
    handleSubmit: handleSubmitChwDetails,
  } = useForm({
    // resolver: yupResolver(
    //   idType === idTypeEnum.idNumber ? chwSchemaIdNr : chwSchemaPassport
    // ),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });
  const { isDirty } = chwDetailFormState;

  const {
    setValue: adminDetailSetValue,
    formState: adminDetailFormState,
    getValues: adminDetailGetValues,
    handleSubmit: handleSubmitAdminDetails,
    register: userRegister,
  } = useForm({
    resolver: yupResolver(adminSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });
  const isIdNumber = useMemo(
    () => SA_ID_REGEX?.test(userData?.idNumber),
    [userData?.idNumber]
  );

  const { isValid: isAdminDetailValid } = adminDetailFormState;

  const { register: passwordRegister, getValues: passwordGetValues } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onChange',
  });

  const { errors: chwDetailFormErrors, isValid: isChwDetailValid } =
    chwDetailFormState;
  const passwordForm = passwordGetValues();

  useEffect(() => {
    const idNumberIsNumber = /^\d+$/.test(userData?.idNumber);
    if (idNumberIsNumber && userData?.idNumber?.length === 13) {
      setIdType(idTypeEnum.idNumber);
    } else {
      setIdType(idTypeEnum.passport);
    }
  }, [userData]);

  useEffect(() => {
    adminDetailSetValue('email', userData?.email, {
      shouldValidate: true,
    });

    // chwDetailSetValue('idNumber', userData?.idNumber, {
    //   shouldValidate: true,
    // });

    chwDetailSetValue('phoneNumber', userData?.phoneNumber, {
      shouldValidate: true,
    });
    chwDetailSetValue('firstName', userData?.firstName, {
      shouldValidate: true,
    });
    chwDetailSetValue('surname', userData?.surname, {
      shouldValidate: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const saveUser = async (passwordChange: boolean) => {
    const passwordForm = passwordGetValues();
    const adminDataForm = adminDetailGetValues();
    const chwDataForm = chwDetailGetValues();

    const userInputModel: UserModelInput = {
      idNumber: chwDataForm?.idNumber,
      phoneNumber: chwDataForm?.phoneNumber,
      email: adminDataForm?.email,
      userName: chwDataForm?.userName,
      firstName: chwDataForm?.firstName,
      surname: chwDataForm?.surname,
    };

    await updateUser({
      variables: {
        id: userData?.id,
        input: userInputModel,
      },
    })
      .then(() => {
        if (userData?.phoneNumber) refetchUserData();

        setNotification({
          title: 'Successfully Updated User!',
          variant: NOTIFICATION.SUCCESS,
        });
        setPractitionerDetailsHasChanged(false);
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
          id: userData?.id,
          newPassword: passwordForm.password,
        },
      }).then(() => {
        setEditActive(!editActive);
        refetchUserData();
      });
    }
  };

  const onSave = async () => {
    if (hasCoachChange) {
      const copy = cloneDeep(practitioner);

      const input: PractitionerInput = {
        Id: copy.id,
        IsActive: true,
        CoachHierarchy: coach,
        Progress: copy?.progress,
        ProgressWalkthroughComplete: false,
      };

      await updatePractitioner({
        variables: {
          id: practitioner.id,
          input: { ...input },
        },
      });
    }
    let passwordChange = false;
    if (passwordForm?.password?.length > 0) {
      passwordChange = true;
    }
    await saveUser(passwordChange);
    refetchUserData();
    refetchGetPractitionerByUserId();
    setEditActive(!editActive);
  };

  return (
    <div className="border-l-primary border-primary mb-6 rounded-2xl border-2  border-l-8 bg-white lg:min-w-0 lg:flex-1">
      <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Start main area*/}
        <Typography type="h3" text="Personal information" color="textMid" />
        <Divider dividerType="dashed" className="my-4" />
        <form key={'formKey'} className="space-y-3 divide-y divide-gray-200">
          {editActive ? (
            <>
              <div className="space-y-0">
                <div className="grid grid-cols-1 ">
                  {userData && (
                    <>
                      {!isFromAdministratorTable && (
                        <>
                          <div className="my-4 w-full sm:col-span-3">
                            <FormField
                              label={'First name'}
                              nameProp={'firstName'}
                              register={registerCHW}
                              error={chwDetailFormErrors.firstName?.message}
                            />
                          </div>
                          <div className="w-full2 my-4 sm:col-span-3">
                            <FormField
                              label={'Surname *'}
                              nameProp={'surname'}
                              register={registerCHW}
                              error={chwDetailFormErrors?.surname?.message}
                            />
                          </div>
                          {!isRegistered && !isFromAdministratorTable && (
                            <>
                              <div className="my-4 sm:col-span-3">
                                <Typography
                                  text={
                                    'Which kind of identification do you have for the ' +
                                    userTypeToEdit +
                                    '? *'
                                  }
                                  type={'body'}
                                  color={'textMid'}
                                />
                                <div className=" mb-4 flex flex-row">
                                  <Button
                                    className={'mt-3 mr-1 w-full rounded-md '}
                                    type={'filled'}
                                    color={
                                      idType === idTypeEnum.idNumber
                                        ? 'tertiary'
                                        : 'errorBg'
                                    }
                                    onClick={() => {
                                      setIdType(idTypeEnum.idNumber);
                                      localStorage.setItem(
                                        'preferedId',
                                        idTypeEnum.idNumber
                                      );
                                    }}
                                  >
                                    <Typography
                                      type="help"
                                      color={
                                        idType === idTypeEnum.idNumber
                                          ? 'white'
                                          : 'tertiary'
                                      }
                                      text="Id Number"
                                    ></Typography>
                                  </Button>

                                  <Button
                                    className={'mt-3 mr-1 w-full rounded-md '}
                                    type={'filled'}
                                    color={
                                      idType === idTypeEnum.idNumber
                                        ? 'errorBg'
                                        : 'tertiary'
                                    }
                                    onClick={() => {
                                      setIdType(idTypeEnum.passport);
                                      localStorage.setItem(
                                        'preferedId',
                                        idTypeEnum.passport
                                      );
                                    }}
                                  >
                                    <Typography
                                      type="help"
                                      color={
                                        idType === idTypeEnum.passport
                                          ? 'white'
                                          : 'tertiary'
                                      }
                                      text="Passport"
                                    ></Typography>
                                  </Button>
                                </div>
                                <FormField
                                  label={
                                    idType === idTypeEnum.idNumber
                                      ? 'ID number *'
                                      : 'Passport *'
                                  }
                                  nameProp={idTypeEnum.idNumber}
                                  register={registerCHW}
                                  error={chwDetailFormErrors.idNumber?.message}
                                  placeholder={
                                    idType === idTypeEnum.idNumber
                                      ? 'e.g 6201014800088'
                                      : 'e.g EN000666'
                                  }
                                  defaultValue={userData?.idNumber}
                                />
                              </div>
                            </>
                          )}
                          <div className="my-4 w-6/12 sm:col-span-3">
                            <FormField
                              label={'Cellphone number *'}
                              nameProp={'phoneNumber'}
                              register={registerCHW}
                              error={chwDetailFormErrors.phoneNumber?.message}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {isFromAdministratorTable && (
                    <div className="my-4 w-full sm:col-span-3">
                      <FormField
                        label={'Email address *'}
                        nameProp={'email'}
                        register={userRegister}
                        error={chwDetailFormErrors.email?.message}
                      />
                    </div>
                  )}

                  <div>
                    {(component === UsersRouteRedirectTypeEnum?.principal ||
                      component === UsersRouteRedirectTypeEnum?.practitioner) &&
                      isWhiteLabel && (
                        <Dropdown<string>
                          label={tenant.modules.coachRoleName}
                          fillType="filled"
                          textColor="textLight"
                          fillColor="adminPortalBg"
                          placeholder={'Type to search...'}
                          labelColor="textMid"
                          list={coaches || []}
                          selectedValue={coach || practitionerCoach}
                          onChange={(item) => {
                            setHasCoachChange(true);
                            setCoach(item);
                          }}
                          showSearch
                          isAdminPortalInput={true}
                          className="my-2"
                          disabled={
                            component ===
                              UsersRouteRedirectTypeEnum?.practitioner &&
                            !!practitionerPrincipal
                          }
                        />
                      )}
                    {component === UsersRouteRedirectTypeEnum?.practitioner &&
                      !!practitionerPrincipal &&
                      isWhiteLabel && (
                        <Alert
                          className={'mt-5 mb-3 rounded-xl'}
                          title={
                            `All practitioners at a preschool must have the same ` +
                            tenant.modules.coachRoleName +
                            ` as the principal. To update the ` +
                            tenant.modules.coachRoleName +
                            ` for ${
                              userData?.firstName
                            }'s preschool, please go to the principal's profile: ${
                              practitionerPrincipal?.user?.firstName
                                ? practitionerPrincipal?.user?.firstName
                                : ''
                            } (ID: ${
                              practitionerPrincipal?.user?.idNumber || ''
                            }).`
                          }
                          type={'info'}
                        />
                      )}
                  </div>
                </div>
              </div>
              {component === UsersRouteRedirectTypeEnum?.practitioner ||
              component === UsersRouteRedirectTypeEnum?.principal ||
              component === UsersRouteRedirectTypeEnum?.coach ? (
                <Button
                  className={' w-4/12 rounded-md '}
                  type="filled"
                  isLoading={loading || loadingUpdatePractitioner}
                  color="secondary"
                  disabled={
                    !isChwDetailValid || loadingUpdatePractitioner || loading
                  }
                  onClick={
                    isDirty
                      ? () => setPractitionerDetailsHasChanged(true)
                      : handleSubmitChwDetails(onSave)
                  }
                >
                  <SaveIcon color="white" className="mr-6 h-6 w-6" />
                  <Typography type="help" color="white" text={'Save Changes'} />
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
                  <SaveIcon color="white" className="mr-6 h-6 w-6" />
                  <Typography
                    type="help"
                    color="white"
                    text={'Save Changes'}
                  ></Typography>
                </Button>
              )}
            </>
          ) : userData && !isFromAdministratorTable ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-x-12">
                <div className="flex gap-2">
                  <Typography
                    type="h4"
                    color="textMid"
                    text={isIdNumber ? 'ID:' : 'Passport:'}
                  />
                  <Typography
                    type="body"
                    color="textMid"
                    text={userData?.idNumber}
                  />
                </div>
                <div className="flex gap-2">
                  <Typography type="h4" color="textMid" text={'Cellphone:'} />
                  <Typography
                    type="body"
                    color="textMid"
                    text={userData?.phoneNumber}
                  />
                </div>
                {userData?.email && (
                  <div className="flex gap-2">
                    <Typography type="h4" color="textMid" text={'Email:'} />
                    <Typography
                      type="body"
                      color="textMid"
                      text={userData?.email}
                    />
                  </div>
                )}
                {practitioner?.coachName && (
                  <div className="flex gap-2">
                    <Typography type="h4" color="textMid" text={'Coach:'} />
                    <Typography
                      type="body"
                      color="textMid"
                      text={practitioner?.coachName}
                    />
                  </div>
                )}
                {userData?.whatsAppNumber && (
                  <div className="flex gap-2">
                    <Typography type="h4" color="textMid" text={'WhatsApp:'} />
                    <Typography
                      type="body"
                      color="textMid"
                      text={userData?.whatsAppNumber}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-row justify-start pt-4 text-current">
              <p className="px-4 text-xl">Email: {userData?.email}</p>
            </div>
          )}
        </form>
        {/* End main area */}
      </div>

      <div className="flex justify-end p-4">
        {userData?.isActive && isAdministrator && (
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
      <Dialog
        className="rounded-2xl py-36 px-72"
        visible={practitionerDetailsHasChanged}
        position={DialogPosition.Middle}
      >
        <ActionModal
          className="z-80"
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to change ${userData?.firstName}'s details?`}
          detailText={`This change will reflect on the app for ${userData?.firstName} immediately.`}
          actionButtons={[
            {
              text: 'Yes, confirm',
              textColour: 'white',
              colour: 'secondary',
              type: 'filled',
              onClick: handleSubmitChwDetails(onSave),
              leadingIcon: 'BadgeCheckIcon',
              isLoading: loading,
            },
            {
              text: 'No, cancel',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => setPractitionerDetailsHasChanged(false),
              leadingIcon: 'XIcon',
            },
          ]}
          buttonClass="rounded-2xl"
        />
      </Dialog>
    </div>
  );
};
