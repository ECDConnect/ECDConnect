import { useMutation } from '@apollo/client';
import {
  DefaultTheme,
  DefaultThemeType,
  ThemeModel,
  useNotifications,
  NOTIFICATION,
} from '@ecdlink/core';
import { FileTypeEnum, FileUpload, UpdateTheme } from '@ecdlink/graphql';
import { Typography, Button } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ContentLoader from '../../../../components/content-loader/content-loader';
import {
  initialThemeColours,
  themeColoursScheme,
} from '../../../../schemas/themeColours';
import {
  initialThemeFonts,
  themeFontsScheme,
} from '../../../../schemas/themeFonts';
import {
  initialThemeImages,
  themeImagesScheme,
} from '../../../../schemas/themeImages';
import FormColorField from '../../../../components/form-color-field/form-color-field';
import { SaveIcon } from '@heroicons/react/solid';
import FormFileInput from '../../../../components/form-file-input/form-file-input';
import { TenantContextType } from '../../../../hooks/useTenant';
import { lightenColor } from '../../../../utils/color-utils/color-utils';

interface SettingsThemeProps {
  tenant: TenantContextType;
  defaultTheme: DefaultThemeType;
}

export const SettingsTheme: React.FC<SettingsThemeProps> = ({
  tenant,
  defaultTheme,
}) => {
  const [updateTheme] = useMutation(UpdateTheme);
  const [fileUpload] = useMutation(FileUpload);
  const [data, setData] = useState({} as any);
  const { setNotification } = useNotifications();
  const [loading, setLoading] = useState<boolean>(false);
  const [editColorsActive, setEditColorsActive] = useState<boolean>(false);
  const acceptedFormats = ['svg', 'png', 'PNG'];
  const allowedFileSize = 13631488;

  // COLOR FORMS
  const {
    register: colorRegister,
    setValue: colorSetValue,
    formState: colorFormState,
    getValues: colorGetValues,
  } = useForm({
    resolver: yupResolver(themeColoursScheme),
    defaultValues: initialThemeColours,
    mode: 'onBlur',
  });
  const { errors: colorErrors, isValid: colorValid } = colorFormState;

  // IMAGES FORMS
  const {
    register: imagesRegister,
    setValue: imagesSetValue,
    getValues: imagesGetValues,
  } = useForm({
    resolver: yupResolver(themeImagesScheme),
    defaultValues: initialThemeImages,
    mode: 'onBlur',
  });

  // FONTS FORMS
  const {
    register: fontsRegister,
    setValue: fontsSetValue,
    getValues: fontsGetValues,
  } = useForm({
    resolver: yupResolver(themeFontsScheme),
    defaultValues: initialThemeFonts,
    mode: 'onBlur',
  });

  const getData = async () => {
    setLoading(true);
    if (tenant && tenant.tenant && tenant.tenant.themePath) {
      await fetch(tenant.tenant.themePath, { cache: 'no-store' })
        .then(function (res) {
          return res.json();
        })
        .then(async function (data) {
          setData(data);
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [tenant]);

  useEffect(() => {
    if (data && data.colors) {
      colorSetValue('primary', data.colors.primary);
      colorSetValue('secondary', data.colors.secondary);
      colorSetValue('tertiary', data.colors.tertiary);
      colorSetValue('primaryAccent1', data.colors.primaryAccent1);
      colorSetValue('primaryAccent2', data.colors.primaryAccent2);
      colorSetValue('secondaryAccent1', data.colors.secondaryAccent1);
      colorSetValue('secondaryAccent2', data.colors.secondaryAccent2);
      colorSetValue('tertiaryAccent1', data.colors.tertiaryAccent1);
      colorSetValue('textDark', data.colors.textDark);
      colorSetValue('textMid', data.colors.textMid);
      colorSetValue('textLight', data.colors.textLight);
      colorSetValue('uiMidDark', data.colors.uiMidDark);
      colorSetValue('uiMid', data.colors.uiMid);
      colorSetValue('uiLight', data.colors.uiLight);
      colorSetValue('uiBg', data.colors.uiBg);
      colorSetValue('modalBg', data.colors.modalBg);
      colorSetValue('errorMain', data.colors.errorMain);
      colorSetValue('errorDark', data.colors.errorDark);
      colorSetValue('errorBg', data.colors.errorBg);
      colorSetValue('alertMain', data.colors.alertMain);
      colorSetValue('alertDark', data.colors.alertDark);
      colorSetValue('alertBg', data.colors.alertBg);
      colorSetValue('successMain', data.colors.successMain);
      colorSetValue('successDark', data.colors.successDark);
      colorSetValue('successBg', data.colors.successBg);
      colorSetValue('infoMain', data.colors.infoMain);
      colorSetValue('infoDark', data.colors.infoDark);
      colorSetValue('infoBb', data.colors.infoBb);

      colorSetValue('quatenary', data.colors.quatenary);
      colorSetValue('quatenaryMain', data.colors.quatenaryMain);
      colorSetValue('adminPortalBg', data.colors.adminPortalBg);
      colorSetValue('darkBlue', data.colors.darkBlue);
      colorSetValue('pointsCardBg', data.colors.pointsCardBg);
      colorSetValue('pointsCardBarBg', data.colors.pointsCardBarBg);
      colorSetValue('quatenaryBg', data.colors.quatenaryBg);
      colorSetValue('adminBackground', data.colors.adminBackground);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (data && data.images) {
      imagesSetValue('logoUrl', data.images.logoUrl);
      imagesSetValue('graphicOverlayUrl', data.images.graphicOverlayUrl);
      imagesSetValue('faviconUrl', data.images.faviconUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (fontsRegister) {
      fontsSetValue('fontUrl', defaultTheme.fontUrl);
      fontsSetValue(
        'mainHeadingOverrideFontUrl',
        defaultTheme.mainHeadingOverrideFontUrl
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsRegister]);

  const saveTheme = async () => {
    setLoading(true);
    const colors = colorGetValues();
    const images = imagesGetValues();
    const fontUrls = fontsGetValues();

    if (colorValid) {
      let logoUrl = '';
      if (images.logoUrl && images.logoUrl.file && images.logoUrl.fileName) {
        await fileUpload({
          variables: {
            file: images.logoUrl.file,
            fileName: images.logoUrl.fileName,
            fileType: FileTypeEnum.Theme,
          },
        }).then((result) => {
          if (result && result.data) {
            logoUrl = result.data.fileUpload.url;
          }
        });
      }

      let graphicOverlayUrl = '';
      if (
        images.graphicOverlayUrl &&
        images.graphicOverlayUrl.file &&
        images.graphicOverlayUrl.fileName
      ) {
        await fileUpload({
          variables: {
            file: images.graphicOverlayUrl.file,
            fileName: images.graphicOverlayUrl.fileName,
            fileType: FileTypeEnum.Theme,
          },
        }).then((result) => {
          if (result && result.data) {
            graphicOverlayUrl = result.data.fileUpload.url;
          }
        });
      }

      let faviconUrl = '';
      if (
        images.faviconUrl &&
        images.faviconUrl.file &&
        images.faviconUrl.fileName
      ) {
        await fileUpload({
          variables: {
            file: images.faviconUrl.file,
            fileName: images.faviconUrl.fileName,
            fileType: FileTypeEnum.Theme,
          },
        }).then((result) => {
          if (result && result.data) {
            faviconUrl = result.data.fileUpload.url;
          }
        });
      }

      let primaryLighter50 = lightenColor(colors.primary, 50); // 50% lighter
      let primaryLighter20 = lightenColor(colors.primary, 20); // 25% lighter
      let secondaryLighter50 = lightenColor(colors.secondary, 50); // 50% lighter
      let secondaryLighter20 = lightenColor(colors.secondary, 20); // 25% lighter
      let tertiaryLighter50 = lightenColor(colors.tertiary, 50); // 50% lighter
      let tertiaryLighter20 = lightenColor(colors.tertiary, 20); // 25% lighter

      const themeVersion = data && data.version ? Number(data.version) + 1 : 1;
      const themeInputModel: ThemeModel = {
        version: themeVersion,
        colors: {
          primary: colors.primary,
          primaryAccent1: primaryLighter20,
          primaryAccent2: primaryLighter50,
          secondary: colors.secondary,
          secondaryAccent1: secondaryLighter20,
          secondaryAccent2: secondaryLighter50,
          tertiary: colors.tertiary,
          tertiaryAccent1: tertiaryLighter20,
          tertiaryAccent2: tertiaryLighter50,
          textDark: colors.textDark,
          textMid: colors.textMid,
          textLight: colors.textLight,
          uiMidDark: colors.uiMidDark,
          uiMid: colors.uiMid,
          uiLight: colors.uiLight,
          uiBg: colors.uiBg,
          modalBg: colors.modalBg,
          errorMain: colors.errorMain,
          errorDark: colors.errorDark,
          errorBg: colors.errorBg,
          alertMain: colors.alertMain,
          alertDark: colors.alertDark,
          alertBg: colors.alertBg,
          successMain: colors.successMain,
          successDark: colors.successDark,
          successBg: colors.successBg,
          infoMain: colors.infoMain,
          infoDark: colors.infoDark,
          infoBb: colors.infoBb,
          quatenary: colors.quatenary,
          quatenaryMain: colors.quatenaryMain,
          adminPortalBg: colors.adminPortalBg,
          darkBlue: colors.darkBlue,
          pointsCardBg: colors.pointsCardBg,
          pointsCardBarBg: colors.pointsCardBarBg,
          quatenaryBg: colors.quatenaryBg,
          adminBackground: colors.adminBackground,
          quinary: colors.quinary,
        },
        fonts: {
          fontUrl: fontUrls.fontUrl ? fontUrls.fontUrl : DefaultTheme.fontUrl,
          mainHeadingOverrideFontUrl: fontUrls.mainHeadingOverrideFontUrl
            ? fontUrls.mainHeadingOverrideFontUrl
            : DefaultTheme.mainHeadingOverrideFontUrl,
        },
        images: {
          graphicOverlayUrl: graphicOverlayUrl
            ? graphicOverlayUrl
            : data.images.graphicOverlayUrl,
          logoUrl: logoUrl ? logoUrl : data.images.logoUrl,
          faviconUrl: faviconUrl ? faviconUrl : data.images.faviconUrl,
          portalLoginLogoUrl: DefaultTheme.portalLoginLogoUrl,
          portalLoginBackgroundUrl: DefaultTheme.portalLoginBackgroundUrl,
        },
      };

      const themeString = JSON.stringify(themeInputModel);
      await updateTheme({
        variables: {
          input: themeString,
        },
      })
        .then(() => {
          setNotification({
            title: 'Successfully Updated Tenant!',
            variant: NOTIFICATION.SUCCESS,
          });
          setData({});
          getData();
        })
        .catch((err) => {
          setNotification({
            title: 'Failed to update Tenant',
            variant: NOTIFICATION.ERROR,
          });
        });
    }
    setEditColorsActive(!editColorsActive);
    setLoading(false);
  };

  if (!loading) {
    return (
      <div className="border-l-primary border-primary m-10 mt-0  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          {/* Start main area*/}
          <h3 className="border-b-4 border-dashed pb-2 text-xl ">
            {' '}
            Colours & Logos{' '}
          </h3>
          {editColorsActive ? (
            <>
              <form
                key={`themecoloursForm:${new Date().getTime()}`}
                className={'space-y-4'}
              >
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
                <div className="mt-2 grid grid-cols-3 gap-8">
                  <div>
                    <Typography type="help" color="textMid" text={`Primary`} />
                    <FormColorField
                      setValue={colorSetValue}
                      currentColor={colorGetValues()?.primary ?? ''}
                      label={''}
                      nameProp={'primary'}
                      register={colorRegister}
                      error={colorErrors?.primary?.message}
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
                      setValue={colorSetValue}
                      currentColor={colorGetValues()?.secondary ?? ''}
                      label={''}
                      nameProp={'secondary'}
                      register={colorRegister}
                      error={colorErrors?.secondary?.message}
                      isAdminPortalField={true}
                    />
                  </div>
                  <div>
                    <Typography type="help" color="textMid" text={`Tertiary`} />
                    <FormColorField
                      setValue={colorSetValue}
                      currentColor={colorGetValues()?.tertiary ?? ''}
                      label={''}
                      nameProp={'tertiary'}
                      register={colorRegister}
                      error={colorErrors?.tertiary?.message}
                      isAdminPortalField={true}
                    />
                  </div>
                </div>
              </form>

              <form key={`themeimagesForm:${new Date().getTime()}`}>
                <div className="mt-4 mb-2 flex items-center gap-4">
                  <Typography type="h3" text={`Logos`} color="textDark" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-8">
                  <div>
                    <Typography
                      type="h4"
                      color="textMid"
                      text={`Dark version (svg, png, jpeg)`}
                    />
                    <Typography
                      type="help"
                      color="textMid"
                      text={`This version will be placed on a light background`}
                    />
                    <Typography
                      text={`Size limit: <b class='text-errorMain'>${
                        allowedFileSize / (1024 * 1024)
                      } </b><span class='text-textMid'>MB</span>`}
                      type={'markdown'}
                      color="textDark"
                      className="my-2"
                    />
                    <FormFileInput
                      acceptedFormats={acceptedFormats}
                      contentUrl={data?.images?.logoUrl}
                      nameProp="logoUrl"
                      setValue={imagesSetValue}
                      label={''}
                      isWizardComponent={true}
                      hideFileName={true}
                      hideAcceptedFormats={true}
                      isImage={true}
                      allowedFileSize={allowedFileSize}
                    />
                  </div>
                  <div>
                    <Typography
                      type="h4"
                      color="textMid"
                      text={`Light version (svg, png, jpeg)`}
                    />
                    <Typography
                      type="help"
                      color="textMid"
                      text={`This version will be placed on a dark background`}
                    />
                    <Typography
                      text={`Size limit: <b class='text-errorMain'>${
                        allowedFileSize / (1024 * 1024)
                      } </b><span class='text-textMid'>MB</span>`}
                      type={'markdown'}
                      color="textDark"
                      className="my-2"
                    />
                    <FormFileInput
                      acceptedFormats={acceptedFormats}
                      contentUrl={data?.images?.graphicOverlayUrl}
                      label={''}
                      nameProp="graphicOverlayUrl"
                      setValue={imagesSetValue}
                      isWizardComponent={true}
                      hideFileName={true}
                      hideAcceptedFormats={true}
                      isImage={true}
                      allowedFileSize={allowedFileSize}
                    />
                  </div>
                  <div>
                    <Typography
                      type="h4"
                      color="textMid"
                      text={`Favicon (ico)`}
                    />
                    <Typography
                      type="help"
                      color="textMid"
                      text={`This version will be shown on the browser tab and app icon`}
                    />
                    <Typography
                      text={`Size limit: <b class='text-errorMain'>${
                        allowedFileSize / (1024 * 1024)
                      } </b><span class='text-textMid'>MB</span>`}
                      type={'markdown'}
                      color="textDark"
                      className="my-2"
                    />
                    <FormFileInput
                      acceptedFormats={['ico']}
                      contentUrl={data?.images?.faviconUrl}
                      label={''}
                      nameProp="faviconUrl"
                      setValue={imagesSetValue}
                      isWizardComponent={true}
                      hideFileName={true}
                      hideAcceptedFormats={true}
                      isImage={true}
                      allowedFileSize={allowedFileSize}
                    />
                  </div>
                </div>
              </form>
              <div className="mt-4">
                <Button
                  className={' w-4/12 rounded-md '}
                  type="filled"
                  color="quatenary"
                  disabled={!colorValid}
                  onClick={() => saveTheme()}
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
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                <p className="px-4 text-xl">Primary:</p>
                <p className="px-4 text-xl">Secondary:</p>
                <p className="px-4 text-xl">Tertiary:</p>
              </div>
              <div className="pointer-events-none grid grid-cols-3 gap-y-6 gap-x-4 sm:grid-cols-3">
                <div>
                  <FormColorField
                    setValue={colorSetValue}
                    currentColor={data?.colors?.primary}
                    label={''}
                    nameProp={'primary'}
                    register={colorRegister}
                    isAdminPortalField={true}
                  />
                </div>
                <div>
                  <FormColorField
                    setValue={colorSetValue}
                    currentColor={data?.colors?.secondary}
                    label={''}
                    nameProp={'secondary'}
                    register={colorRegister}
                    isAdminPortalField={true}
                  />
                </div>
                <div>
                  <FormColorField
                    setValue={colorSetValue}
                    currentColor={data?.colors?.tertiary}
                    label={''}
                    nameProp={'tertiary'}
                    register={colorRegister}
                    isAdminPortalField={true}
                  />
                </div>
              </div>
              {data && data.images && (
                <>
                  <div className="mt-4 grid grid-cols-3 gap-y-6 gap-x-4 sm:grid-cols-3">
                    <p className="px-4 text-xl">
                      Dark version (svg, png, jpeg):
                    </p>
                    <p className="px-4 text-xl">
                      Light version (svg, png, jpeg):
                    </p>
                    <p className="px-4 text-xl">Favicon (ico):</p>
                  </div>
                  <div className="pointer-events-none mt-2 grid grid-cols-3 gap-y-6 gap-x-4 sm:grid-cols-3">
                    <div>
                      <FormFileInput
                        acceptedFormats={acceptedFormats}
                        contentUrl={data?.images?.logoUrl}
                        label={''}
                        nameProp="logoUrl"
                        setValue={imagesSetValue}
                        disabled={true}
                        isWizardComponent={true}
                        hideFileName={true}
                        hideAcceptedFormats={true}
                        isImage={true}
                      />
                    </div>
                    <div>
                      <FormFileInput
                        acceptedFormats={acceptedFormats}
                        contentUrl={data?.images?.graphicOverlayUrl}
                        label={''}
                        nameProp="graphicOverlayUrl"
                        setValue={imagesSetValue}
                        disabled={true}
                        isWizardComponent={true}
                        hideFileName={true}
                        hideAcceptedFormats={true}
                        isImage={true}
                      />
                    </div>
                    <div>
                      <FormFileInput
                        acceptedFormats={['ico']}
                        contentUrl={data?.images?.faviconUrl}
                        label={''}
                        nameProp="faviconUrl"
                        setValue={imagesSetValue}
                        disabled={true}
                        isWizardComponent={true}
                        hideFileName={true}
                        hideAcceptedFormats={true}
                        isImage={true}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex justify-end p-4">
          <Button
            onClick={() => {
              setEditColorsActive(!editColorsActive);
            }}
            color="quatenary"
            textColor="white"
            id="dropdownHoverButton"
            className="bg-quatenary focus:border-quatenary w-1/ focus:outline-none focus:ring-quatenary dark:bg-quatenary dark:hover:bg-grey-300 dark:focus:ring-quatenary inline-flex items-center rounded-lg py-2.5 px-12 text-center text-sm font-medium text-white hover:bg-gray-300 focus:ring-2"
            type="filled"
            icon={editColorsActive ? '' : 'PencilIcon'}
          >
            {' '}
            {editColorsActive ? 'Close' : 'Edit'}
          </Button>
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
};
