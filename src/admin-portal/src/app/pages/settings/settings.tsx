import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useTenant } from '../../hooks/useTenant';
import { Alert, Button, Card, Typography } from '@ecdlink/ui';
import { InformationCircleIcon, SaveIcon } from '@heroicons/react/solid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '../../components/form-field/form-field';
import { TenantInfoInputModelInput, UpdateTenantInfo } from '@ecdlink/graphql';
import { useUser } from '../../hooks/useUser';
import { DefaultTheme, NOTIFICATION, useNotifications } from '@ecdlink/core';
import FormColorField from '../../components/form-color-field/form-color-field';
import { lightenColor } from '../../utils/color-utils/color-utils';

export interface SettingsRouteState {
  overrideDefaultUrl?: string;
}

const adminSchema = yup.object().shape({
  organisationName: yup.string().required('Organisation name is required'),
  applicationName: yup.string().required('Application name is required'),
  organisationEmail: yup.string().email().required('Email address is required'),
});

export function Settings() {
  const location = useLocation<SettingsRouteState>();
  const overrideDefaultUrl = location?.state?.overrideDefaultUrl;
  const blueCardTitleText = `You can return all settings to the default if you've made a mistake.`;
  const [editActive, setEditActive] = useState<boolean>(false);
  const [editColorsActive, setEditColorsActive] = useState<boolean>(false);
  const tenant = useTenant();
  const { hasPermission } = useUser();
  const { setNotification, clearNotification } = useNotifications();
  const [primaryColourError, setPrimaryColourError] = useState('');
  const [secondaryColourError, setSecondaryColourError] = useState('');
  const [tertiaryColourError, setTertiaryColourError] = useState('');
  const [disableButton, setDisableButton] = useState(false);

  const {
    register,
    setValue: adminDetailSetValue,
    formState: adminDetailFormState,
    getValues: adminDetailGetValues,
    handleSubmit: handleSubmitAdminDetails,
    control,
  } = useForm({
    resolver: yupResolver(adminSchema),
    mode: 'onChange',
  });

  const { primaryColor, secondaryColor, tertiaryColor } = useWatch({ control });

  const hexRegex = /^#[0-9A-F]{6}$/i;
  const errorMessage = 'Only hex values are accept';
  const primaryColourIsValid = hexRegex?.test(primaryColor);
  const primaryColourStartsWithHash = primaryColor?.startsWith('#');
  const secondaryColourIsValid = hexRegex?.test(secondaryColor);
  const secondaryColourStartsWithHash = secondaryColor?.startsWith('#');
  const tertiaryColourIsValid = hexRegex?.test(tertiaryColor);
  const tertiaryColourStartsWithHash = tertiaryColor?.startsWith('#');

  let primaryLighter50 = primaryColor && lightenColor(primaryColor, 50); // 50% lighter
  let primaryLighter20 = primaryColor && lightenColor(primaryColor, 20); // 25% lighter
  let secondaryLighter50 = secondaryColor && lightenColor(secondaryColor, 50); // 50% lighter
  let secondaryLighter20 = secondaryColor && lightenColor(secondaryColor, 20); // 25% lighter
  let tertiaryLighter50 = tertiaryColor && lightenColor(tertiaryColor, 50); // 50% lighter
  let tertiaryLighter20 = tertiaryColor && lightenColor(tertiaryColor, 20); // 25% lighter

  const { errors: adminDetailFormErrors, isValid: isAdminDetailValid } =
    adminDetailFormState;

  const [updateTenant, { loading }] = useMutation(UpdateTenantInfo);

  useEffect(() => {
    adminDetailSetValue('organisationName', tenant?.tenant?.organisationName, {
      shouldValidate: true,
    });
    adminDetailSetValue('applicationName', tenant?.tenant?.applicationName, {
      shouldValidate: true,
    });
    adminDetailSetValue(
      'organisationEmail',
      tenant?.tenant?.organisationEmail,
      {
        shouldValidate: true,
      }
    );

    adminDetailSetValue('primaryColor', '#27385A', {
      shouldValidate: true,
    });

    adminDetailSetValue('secondaryColor', '#FF2180', {
      shouldValidate: true,
    });
    adminDetailSetValue('tertiaryColor', '#83BB26', {
      shouldValidate: true,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  useEffect(() => {
    if (primaryColor) {
      adminDetailSetValue('primaryAccent1', primaryLighter20);
      adminDetailSetValue('primaryAccent2', primaryLighter50);
    }
  }, [primaryColor, primaryLighter20, primaryLighter50, adminDetailSetValue]);
  useEffect(() => {
    if (secondaryColor) {
      adminDetailSetValue('secondaryAccent1', secondaryLighter20);
      adminDetailSetValue('secondaryAccent2', secondaryLighter50);
    }
  }, [
    secondaryColor,
    secondaryLighter20,
    secondaryLighter50,
    adminDetailSetValue,
  ]);

  useEffect(() => {
    if (tertiaryColor) {
      adminDetailSetValue('primaryAccent1', tertiaryLighter20);
      adminDetailSetValue('primaryAccent2', tertiaryLighter50);
    }
  }, [
    adminDetailSetValue,
    tertiaryColor,
    tertiaryLighter20,
    tertiaryLighter50,
  ]);

  useEffect(() => {
    if (primaryColourIsValid && primaryColourStartsWithHash) {
      setPrimaryColourError('');
    } else {
      setPrimaryColourError(errorMessage);
    }
  }, [primaryColourIsValid, primaryColourStartsWithHash]);
  useEffect(() => {
    if (secondaryColourIsValid && secondaryColourStartsWithHash) {
      setSecondaryColourError('');
    } else {
      setSecondaryColourError(errorMessage);
    }
  }, [secondaryColourIsValid, secondaryColourStartsWithHash]);

  useEffect(() => {
    if (tertiaryColourIsValid && tertiaryColourStartsWithHash) {
      setTertiaryColourError('');
    } else {
      setTertiaryColourError(errorMessage);
    }
  }, [tertiaryColourIsValid, tertiaryColourStartsWithHash]);

  useEffect(() => {
    if (primaryColourError || secondaryColourError || tertiaryColourError) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [
    primaryColourError,
    secondaryColourError,
    setDisableButton,
    tertiaryColourError,
  ]);

  const onSave = async () => {
    const adminDataForm = adminDetailGetValues();

    const tenantInput: TenantInfoInputModelInput = {
      organisationName: adminDataForm.organisationName,
      organisationEmail: adminDataForm.organisationEmail,
      applicationName: adminDataForm.applicationName,
    };

    await updateTenant({
      variables: {
        id: tenant?.tenant?.id,
        input: tenantInput,
      },
    })
      .then(() => {
        setNotification({
          title: 'Successfully Updated Tenant!',
          variant: NOTIFICATION.SUCCESS,
        });
        tenant.refresh();
      })
      .catch((err) => {
        setNotification({
          title: 'Failed to update Tenant',
          variant: NOTIFICATION.ERROR,
        });
      });

    setEditActive(!editActive);
  };

  return (
    <div className="text-textDark">
      <div className="my-4 w-11/12">
        <Card className="bg-infoMain my-8 flex flex-col gap-2 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <InformationCircleIcon className="h-5 w-5 text-white" />
            <Typography type={'h4'} text={blueCardTitleText} color={'white'} />
          </div>
        </Card>
        <div className="border-l-primary border-primary m-10 mt-0  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}
            <h3 className="border-b-4 border-dashed pb-2 text-xl ">
              {' '}
              Instance name and contact details{' '}
            </h3>
            <form
              key={'formKey'}
              className="space-y-3 divide-y divide-gray-200"
            >
              {editActive ? (
                <>
                  <div className="space-y-0">
                    <Alert
                      title={
                        'Editing the names below will change what users see in the app.'
                      }
                      type={'info'}
                      className="mt-2"
                    />
                    <div className="grid grid-cols-1 ">
                      <div className="my-4 w-6/12 sm:col-span-3">
                        <FormField
                          label={'Organisation name *'}
                          nameProp={'organisationName'}
                          register={register}
                          error={
                            adminDetailFormErrors.organisationName?.message
                          }
                        />
                      </div>
                      <div className="my-4 w-6/12 sm:col-span-3">
                        <FormField
                          label={'App name *'}
                          nameProp={'applicationName'}
                          register={register}
                          error={adminDetailFormErrors.applicationName?.message}
                        />
                      </div>
                      <div className="my-4 w-6/12 sm:col-span-3">
                        <FormField
                          label={'Organisation email *'}
                          subLabel={
                            'When users fill in the help form on the app, notifications will be sent to this email address with relevant details.'
                          }
                          nameProp={'organisationEmail'}
                          register={register}
                          error={
                            adminDetailFormErrors.organisationEmail?.message
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    className={' w-4/12 rounded-md '}
                    type="filled"
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
                    Organisation Name: {tenant?.tenant?.organisationName}
                  </p>
                  <p className="px-4 text-xl">
                    App Name: {tenant?.tenant?.applicationName}
                  </p>
                  <p className="px-4 text-xl">
                    Email: {tenant?.tenant?.organisationEmail}
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
        <div className="border-l-primary border-primary m-10 mt-0  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
          <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
            {/* Start main area*/}
            <h3 className="border-b-4 border-dashed pb-2 text-xl ">
              {' '}
              Colours & Logos{' '}
            </h3>
            <form key={'formKey'} className="space-y-3">
              {editColorsActive ? (
                <>
                  <div className="mt-12 mb-2 flex items-center gap-4">
                    <Typography type="h3" text={`Colours`} color="textDark" />
                  </div>
                  <div className="mt-12 mb-2 flex items-center gap-4">
                    <Typography
                      type="h4"
                      color="textDark"
                      text={`Add your organisation's hex colour codes`}
                    />
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-8">
                    <div>
                      <Typography
                        type="help"
                        color="textMid"
                        text={`Primary`}
                      />
                      <FormColorField
                        setValue={adminDetailSetValue}
                        currentColor={
                          adminDetailGetValues()?.primaryColor ?? ''
                        }
                        label={''}
                        nameProp={'primaryColor'}
                        register={register}
                        error={primaryColourError}
                        isAdminPortalField={true}
                      />
                    </div>
                    <div>
                      <Typography
                        type="help"
                        color="textMid"
                        text={`Secondary`}
                      />
                      <FormColorField
                        setValue={adminDetailSetValue}
                        currentColor={
                          adminDetailGetValues()?.secondaryColor ?? ''
                        }
                        label={''}
                        nameProp={'secondaryColor'}
                        register={register}
                        error={secondaryColourError}
                        isAdminPortalField={true}
                      />
                    </div>
                    <div>
                      <Typography
                        type="help"
                        color="textMid"
                        text={`Tertiary`}
                      />
                      <FormColorField
                        setValue={adminDetailSetValue}
                        currentColor={
                          adminDetailGetValues()?.tertiaryColor ?? ''
                        }
                        label={''}
                        nameProp={'tertiaryColor'}
                        register={register}
                        error={tertiaryColourError}
                        isAdminPortalField={true}
                      />
                    </div>
                  </div>
                  <Button
                    className={' w-4/12 rounded-md '}
                    type="filled"
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
                <>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                    <p className="px-4 text-xl">Primary:</p>
                    <p className="px-4 text-xl">Secondary:</p>
                    <p className="px-4 text-xl">Tertiary:</p>
                  </div>
                  <div className="grid grid-cols-3 gap-y-6 gap-x-4 sm:grid-cols-3">
                    <FormColorField
                      setValue={adminDetailSetValue}
                      currentColor={adminDetailGetValues()?.primaryColor ?? ''}
                      label={''}
                      nameProp={'primaryColor'}
                      register={register}
                      error={primaryColourError}
                      isAdminPortalField={true}
                      disabled={true}
                    />
                    <FormColorField
                      setValue={adminDetailSetValue}
                      currentColor={
                        adminDetailGetValues()?.secondaryColor ?? ''
                      }
                      label={''}
                      nameProp={'secondaryColor'}
                      register={register}
                      error={secondaryColourError}
                      isAdminPortalField={true}
                      disabled={true}
                    />
                    <FormColorField
                      setValue={adminDetailSetValue}
                      currentColor={adminDetailGetValues()?.tertiaryColor ?? ''}
                      label={''}
                      nameProp={'tertiaryColor'}
                      register={register}
                      error={tertiaryColourError}
                      isAdminPortalField={true}
                      disabled={true}
                    />
                  </div>
                </>
              )}
            </form>
            {/* End main area */}
          </div>

          <div className="flex justify-end p-4">
            <button
              onClick={() => {
                setEditColorsActive(!editColorsActive);
              }}
              id="dropdownHoverButton"
              className="bg-secondary focus:border-secondary w-1/ focus:outline-none focus:ring-secondary dark:bg-secondary dark:hover:bg-grey-300 dark:focus:ring-secondary inline-flex items-center rounded-lg py-2.5 px-12 text-center text-sm font-medium text-white hover:bg-gray-300 focus:ring-2"
              type="button"
            >
              {' '}
              {editColorsActive ? 'Close' : 'Edit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
