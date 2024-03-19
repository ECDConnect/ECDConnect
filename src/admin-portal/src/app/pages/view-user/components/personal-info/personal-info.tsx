import {
  ActionModal,
  Button,
  Dialog,
  DialogPosition,
  Dropdown,
  PasswordInput,
  SA_CELL_REGEX,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
  Typography,
} from '@ecdlink/ui';
import FormField from '../../../../components/form-field/form-field';
import { UsersRouteRedirectTypeEnum, idTypeEnum } from '../../view-user.types';
import { SaveIcon } from '@heroicons/react/solid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GetAllClinic,
  ResetUserPassword,
  UpdateHealthCareWorkerClinic,
  UpdateUser,
  UserModelInput,
} from '@ecdlink/graphql';
import {
  HealthCareWorkerDto,
  NOTIFICATION,
  UserDto,
  initialPasswordValue,
  initialUserDetailsValues,
  passwordSchema,
  useNotifications,
} from '@ecdlink/core';
import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export interface PersonalInfoProps {
  userData: UserDto;
  chwData: HealthCareWorkerDto;
  isRegistered: boolean;
  component: string;
  isTeamLead: boolean;
  hcwId: string;
  clinicId: string;
  refetchUserData: () => void;
  refetchCHW: () => void;
  isNotLockedOut: (user: UserDto) => boolean;
  clinicIds?: string[];
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  userData,
  isRegistered,
  component,
  isTeamLead,
  hcwId,
  clinicId,
  chwData,
  refetchUserData,
  refetchCHW,
  isNotLockedOut,
  clinicIds,
}) => {
  const [updateHCWClinic] = useMutation(UpdateHealthCareWorkerClinic);
  const [updateUser, { loading }] = useMutation(UpdateUser);
  const [resetUserPassword] = useMutation(ResetUserPassword);
  const { setNotification } = useNotifications();
  const [editActive, setEditActive] = useState<boolean>(false);
  const userObject = useMemo(() => userData, [userData]);
  const [clinic, setClinic] = useState('');
  const [clinics, setClinics] = useState([]);
  const [hasClinicChange, setHasClinicChange] = useState(false);
  const [handleClinicChange, setHandleClinicChange] = useState(false);
  const [idType, setIdType] = useState<string>('idNumber');

  const chwSchema = yup.object().shape({
    idNumber:
      idType === idTypeEnum.idNumber
        ? yup
            .string()
            .matches(SA_ID_REGEX, 'Id number is not valid')
            .required('ID Number is Required')
        : yup
            .string()
            .matches(SA_PASSPORT_REGEX, 'Passport is not valid')
            .required('ID Number is Required'),
    phoneNumber: yup
      .string()
      .matches(SA_CELL_REGEX, 'Phone number is not valid')
      .required('Cellphone number is required'),
  });

  const adminSchema = yup.object().shape({
    email: yup.string().email().required('email address is required'),
  });

  const { data: clinicsData } = useQuery(GetAllClinic, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (clinicsData?.GetAllClinic?.length > 0) {
      setClinics(
        clinicsData?.GetAllClinic?.map((item) => {
          return {
            value: item?.id,
            label: item?.name,
          };
        })
      );
    }
  }, [clinicsData?.GetAllClinic]);

  const hcwClinic = clinicsData?.GetAllClinic?.find(
    (item) => item?.id === clinicId
  );

  const tlClinics = clinicsData?.GetAllClinic?.filter((item) =>
    clinicIds?.some((x) => x === item?.id?.toString())
  );

  const updateHealthCareWorkerClinic = useCallback(async () => {
    const response = await updateHCWClinic({
      variables: {
        userId: userObject?.id,
        clinicId: clinic,
      },
    });

    if (response) {
      setEditActive(!editActive);
    }
  }, [clinic, editActive, updateHCWClinic, userObject?.id]);

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
    setValue: adminDetailSetValue,
    formState: adminDetailFormState,
    getValues: adminDetailGetValues,
    handleSubmit: handleSubmitAdminDetails,
  } = useForm({
    resolver: yupResolver(adminSchema),
    defaultValues: initialUserDetailsValues,
    mode: 'onChange',
  });

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
    const currentPreferedId = localStorage?.getItem('preferedId');

    if (currentPreferedId === idTypeEnum.passport) {
      setIdType(idTypeEnum.passport);
    }
  }, []);

  useEffect(() => {
    adminDetailSetValue('email', userData?.email || chwData?.user.email, {
      shouldValidate: true,
    });

    chwDetailSetValue(
      'idNumber',
      userData?.idNumber || chwData?.user.idNumber,
      {
        shouldValidate: true,
      }
    );

    chwDetailSetValue(
      'phoneNumber',
      userData?.phoneNumber || chwData?.user.phoneNumber,
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
        id: userData?.id ?? chwData?.user.id,
        input: userInputModel,
      },
    })
      .then(() => {
        if (userData?.phoneNumber) refetchUserData();

        if (chwData?.user?.phoneNumber) {
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
          id: userData?.id ?? chwData?.user.id,
          newPassword: passwordForm.password,
        },
      }).then(() => {
        setEditActive(!editActive);
        refetchUserData();
      });
    }
  };

  const onSave = async () => {
    if (hasClinicChange) {
      updateHealthCareWorkerClinic();
      setHandleClinicChange(false);
    }
    let passwordChange = false;
    if (passwordForm.password.length > 0) {
      passwordChange = true;
    }
    await saveUser(passwordChange);
    refetchUserData();
    setEditActive(!editActive);
  };

  return (
    <div className="border-l-primary border-primary m-10 mt-0  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
      <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Start main area*/}
        <h3 className="border-b-4 border-dashed pb-2 text-xl ">
          Personal information
        </h3>
        <form key={'formKey'} className="space-y-3 divide-y divide-gray-200">
          {editActive ? (
            <>
              <div className="space-y-0">
                <div className="grid grid-cols-1 ">
                  {userData && (
                    <>
                      {!isRegistered && (
                        <>
                          <div className="my-4 sm:col-span-3">
                            <Typography
                              text={
                                'Which kind of identification do you have for the CHW? *'
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
                            />
                          </div>
                          {/* <div className="my-4 w-6/12 sm:col-span-3">
                          <FormField
                            label={'ID number *'}
                            nameProp={'idNumber'}
                            register={registerCHW}
                            error={chwDetailFormErrors.idNumber?.message}
                          />
                        </div> */}
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

                  <div>
                    {component === UsersRouteRedirectTypeEnum?.chw && (
                      <Dropdown
                        placeholder={'Click to select a clinic'}
                        className={'justify-between'}
                        label={'Clinic *'}
                        list={clinics}
                        onChange={(item) => {
                          setClinic(item);
                          setHasClinicChange(true);
                        }}
                        fullWidth
                        labelColor="textMid"
                        fillColor="adminPortalBg"
                        selectedValue={clinic || clinicId}
                      />
                    )}
                    {!isTeamLead && !hcwId && (
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
                    )}
                  </div>
                </div>
              </div>
              {component === UsersRouteRedirectTypeEnum?.chw ? (
                <Button
                  className={' w-4/12 rounded-md '}
                  type="filled"
                  isLoading={loading}
                  color="secondary"
                  disabled={!isChwDetailValid}
                  onClick={
                    hasClinicChange
                      ? () => setHandleClinicChange(true)
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
          ) : userData ? (
            <div>
              <div className="grid grid-cols-3 justify-start gap-y-8 p-4 text-current">
                <div className="flex items-center">
                  <Typography
                    type="h2"
                    hasMarkup
                    fontSize="18"
                    color="textMid"
                    text={'ID:'}
                    className="px-4"
                  />
                  <Typography
                    type="h2"
                    hasMarkup
                    fontSize="18"
                    color="textMid"
                    text={userData?.idNumber || chwData?.user?.idNumber}
                  />
                </div>
                <div className="flex items-center">
                  <Typography
                    type="h2"
                    hasMarkup
                    fontSize="18"
                    color="textMid"
                    text={'Cellphone:'}
                    className="px-4"
                  />
                  <Typography
                    type="h2"
                    hasMarkup
                    fontSize="18"
                    color="textMid"
                    text={userData?.phoneNumber || chwData?.user?.phoneNumber}
                  />
                </div>
                {userData?.whatsAppNumber && (
                  <div className="flex items-center">
                    <Typography
                      type="h2"
                      hasMarkup
                      fontSize="18"
                      color="textMid"
                      text={'WhatsApp:'}
                      className="px-4"
                    />
                    <Typography
                      type="h2"
                      hasMarkup
                      fontSize="18"
                      color="textMid"
                      text={
                        userData?.whatsAppNumber ||
                        chwData?.user?.whatsAppNumber
                      }
                    />
                  </div>
                )}
              </div>
              {hcwClinic && (
                <div className="ml-4 flex w-11/12 items-center justify-between">
                  <div className="flex w-full items-center">
                    <Typography
                      type="h2"
                      hasMarkup
                      fontSize="18"
                      color="textMid"
                      text={'Clinic:'}
                      className="px-4"
                    />
                    <Typography
                      type="h2"
                      hasMarkup
                      fontSize="18"
                      color="textMid"
                      text={hcwClinic?.name}
                    />
                  </div>
                  <div className="flex w-full items-center">
                    <Typography
                      type="h2"
                      hasMarkup
                      fontSize="18"
                      color="textMid"
                      text={'Location:'}
                      className="px-4"
                    />
                    <div className="flex flex-col items-center">
                      <Typography
                        type="h2"
                        hasMarkup
                        fontSize="18"
                        color="textMid"
                        text={`${hcwClinic?.subDistrict?.name}, `}
                        className="w-96"
                      />
                      <Typography
                        type="h2"
                        hasMarkup
                        fontSize="18"
                        color="textMid"
                        text={`${hcwClinic?.subDistrict?.district?.name}, `}
                        className="w-full"
                      />
                      <Typography
                        type="h2"
                        hasMarkup
                        fontSize="18"
                        color="textMid"
                        text={
                          hcwClinic?.subDistrict?.district?.province
                            ?.description
                        }
                        className="flex w-full flex-nowrap"
                      />
                    </div>
                  </div>
                </div>
              )}
              {tlClinics?.length > 0 && (
                <div className="flex w-10/12 items-center justify-between">
                  <div className="flex items-center">
                    <Typography
                      type="h2"
                      hasMarkup
                      fontSize="18"
                      color="textMid"
                      text={'Clinic(s):'}
                      className="px-4"
                    />
                    {tlClinics?.map((item) => {
                      return (
                        <Typography
                          type="h2"
                          hasMarkup
                          fontSize="18"
                          color="textMid"
                          text={item?.name}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center">
                    <Typography
                      type="h2"
                      hasMarkup
                      fontSize="18"
                      color="textMid"
                      text={'Location:'}
                      className="px-4"
                    />
                    {tlClinics?.map((item) => {
                      return (
                        <div className="flex flex-col items-center">
                          <Typography
                            type="h2"
                            hasMarkup
                            fontSize="18"
                            color="textMid"
                            text={`${item?.subDistrict?.name}, `}
                            className="w-96"
                          />
                          <Typography
                            type="h2"
                            hasMarkup
                            fontSize="18"
                            color="textMid"
                            text={`${item?.subDistrict?.district?.name}, `}
                            className="w-full"
                          />
                          <Typography
                            type="h2"
                            hasMarkup
                            fontSize="18"
                            color="textMid"
                            text={
                              item?.subDistrict?.district?.province?.description
                            }
                            className="flex w-full flex-nowrap"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
        {isNotLockedOut(userData ?? chwData?.user) && (
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
        className="absolute left-40 bottom-80 w-6/12"
        visible={handleClinicChange}
        position={DialogPosition.Middle}
      >
        <ActionModal
          className="z-80"
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to change ${userObject?.firstName} clinic?`}
          detailText={`This change will reflect on the app for ${userObject?.firstName} immediately.`}
          actionButtons={[
            {
              text: 'Yes, confirm',
              textColour: 'white',
              colour: 'secondary',
              type: 'filled',
              onClick: handleSubmitChwDetails(onSave),

              leadingIcon: 'BadgeCheckIcon',
            },
            {
              text: 'No, cancel',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => setHandleClinicChange(false),
              leadingIcon: 'XIcon',
            },
          ]}
        />
      </Dialog>
    </div>
  );
};
