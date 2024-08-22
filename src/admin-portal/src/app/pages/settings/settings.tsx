import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useTenant } from '../../hooks/useTenant';
import { useTheme } from '../../../../node_modules/@ecdlink/core';
import {
  Alert,
  ActionModal,
  Button,
  Card,
  Typography,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { InformationCircleIcon, SaveIcon } from '@heroicons/react/solid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormField from '../../components/form-field/form-field';
import { TenantInfoInputModelInput, UpdateTenantInfo } from '@ecdlink/graphql';
import {
  NOTIFICATION,
  useNotifications,
  applyTheme,
  DefaultTheme,
  WhiteLabelTheme,
  ThemeModel,
} from '@ecdlink/core';
import { SettingsTheme } from './sub-pages/theme/settings-theme';
import { ArrowSmLeftIcon } from '@heroicons/react/outline';

export interface SettingsRouteState {
  overrideDefaultUrl?: string;
}

const adminSchema = yup.object().shape({
  organisationName: yup.string().required('Organisation name is required'),
  applicationName: yup.string().required('Application name is required'),
  organisationEmail: yup.string().email().required('Email address is required'),
});

export function Settings() {
  const blueCardTitleText = `You can return all settings to the default if you've made a mistake.`;
  const [editActive, setEditActive] = useState<boolean>(false);

  const tenant = useTenant();
  const { setNotification, clearNotification } = useNotifications();
  const { overRideTheme, setWhiteLabelTheme, theme } = useTheme();
  const [handleRevertModal, setHandleRevertModal] = useState(false);

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

  const resetTheme = () => {
    setWhiteLabelTheme();
    const themeInputModel: ThemeModel = {
      version: theme && theme.version ? theme.version : 1,
      colors: {
        primary: WhiteLabelTheme.primary,
        primaryAccent1: WhiteLabelTheme.primaryAccent1,
        primaryAccent2: WhiteLabelTheme.primaryAccent2,
        secondary: WhiteLabelTheme.secondary,
        secondaryAccent1: WhiteLabelTheme.secondaryAccent1,
        secondaryAccent2: WhiteLabelTheme.secondaryAccent2,
        tertiary: WhiteLabelTheme.tertiary,
        tertiaryAccent1: WhiteLabelTheme.tertiaryAccent1,
        tertiaryAccent2: WhiteLabelTheme.tertiaryAccent2,
        textDark: WhiteLabelTheme.textDark,
        textMid: WhiteLabelTheme.textMid,
        textLight: WhiteLabelTheme.textLight,
        uiMidDark: WhiteLabelTheme.uiMidDark,
        uiMid: WhiteLabelTheme.uiMid,
        uiLight: WhiteLabelTheme.uiLight,
        uiBg: WhiteLabelTheme.uiBg,
        modalBg: WhiteLabelTheme.modalBg,
        errorMain: WhiteLabelTheme.errorMain,
        errorDark: WhiteLabelTheme.errorDark,
        errorBg: WhiteLabelTheme.errorBg,
        alertMain: WhiteLabelTheme.alertMain,
        alertDark: WhiteLabelTheme.alertDark,
        alertBg: WhiteLabelTheme.alertBg,
        successMain: WhiteLabelTheme.successMain,
        successDark: WhiteLabelTheme.successDark,
        successBg: WhiteLabelTheme.successBg,
        infoMain: WhiteLabelTheme.infoMain,
        infoDark: WhiteLabelTheme.infoDark,
        infoBb: WhiteLabelTheme.infoBb,
        quatenary: WhiteLabelTheme.quatenary,
        quatenaryMain: WhiteLabelTheme.quatenaryMain,
        adminPortalBg: WhiteLabelTheme.adminPortalBg,
        darkBlue: WhiteLabelTheme.darkBlue,
        pointsCardBg: WhiteLabelTheme.pointsCardBg,
        pointsCardBarBg: WhiteLabelTheme.pointsCardBarBg,
        quatenaryBg: WhiteLabelTheme.quatenaryBg,
        adminBackground: WhiteLabelTheme.adminBackground,
      },
      fonts: {
        fontUrl: DefaultTheme.fontUrl,
        mainHeadingOverrideFontUrl: DefaultTheme.mainHeadingOverrideFontUrl,
      },
      images: {
        graphicOverlayUrl: DefaultTheme.graphicOverlayUrl,
        logoUrl: DefaultTheme.logoUrl,
        faviconUrl: DefaultTheme.faviconUrl,
        portalLoginLogoUrl: DefaultTheme.portalLoginLogoUrl,
        portalLoginBackgroundUrl: DefaultTheme.portalLoginBackgroundUrl,
      },
    };
    applyTheme();
    overRideTheme(themeInputModel);
    setHandleRevertModal(false);
  };

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

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
        <Card className="bg-infoMain my-8 ml-2 flex flex-col gap-2 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <InformationCircleIcon className="h-5 w-5 text-white" />
            <Typography type={'h4'} text={blueCardTitleText} color={'white'} />
          </div>
          <div className="justify-stretch flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setHandleRevertModal(true)}
              className="bg-quatenary hover:bg-uiLight focus:outline-none ml-3 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
            >
              <ArrowSmLeftIcon className="h-6 w-6" aria-hidden="true" />
              Revert to default
            </button>
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
                    color="quatenary"
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
            <Button
              onClick={() => {
                setEditActive(!editActive);
              }}
              id="dropdownHoverButton"
              className="bg-quatenary focus:border-quatenary w-1/ focus:outline-none focus:ring-quatenary dark:bg-quatenaryBg dark:hover:bg-grey-300 dark:focus:ring-quatenary inline-flex items-center rounded-lg py-2.5 px-12 text-center text-sm font-medium text-white hover:bg-gray-300 focus:ring-2"
              type="filled"
              icon={editActive ? '' : 'PencilIcon'}
              color="quatenary"
              textColor="white"
            >
              {' '}
              {editActive ? 'Close' : 'Edit'}
            </Button>
          </div>
        </div>
        <SettingsTheme
          theme={theme}
          overRideTheme={overRideTheme}
          defaultTheme={DefaultTheme}
        />
      </div>
      <Dialog
        className="absolute w-6/12"
        stretch
        visible={handleRevertModal}
        position={DialogPosition.Middle}
      >
        <ActionModal
          className="z-80"
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to revert to default and lose changes?`}
          detailText="Any changes you have made will be deleted. You will not be able to recover these changes."
          actionButtons={[
            {
              text: 'Yes, revert',
              textColour: 'white',
              colour: 'quatenary',
              type: 'outlined',
              onClick: () => {
                resetTheme();
              },
              leadingIcon: 'ArrowLeftIcon',
            },
            {
              text: 'No, cancel',
              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              onClick: () => setHandleRevertModal(false),
              leadingIcon: 'TrashIcon',
            },
          ]}
        />
      </Dialog>
    </div>
  );
}

export default Settings;
