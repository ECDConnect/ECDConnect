import { useMutation } from '@apollo/client';
import {
  applyTheme,
  DefaultTheme,
  DefaultThemeType,
  NOTIFICATION,
  PermissionEnum,
  ThemeModel,
  useNotifications,
  useTheme,
  WhiteLabelTheme,
} from '@ecdlink/core';
import { FileTypeEnum, FileUpload, UpdateTheme } from '@ecdlink/graphql';
import { Typography, Button } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ContentLoader from '../../../../components/content-loader/content-loader';
import { useUser } from '../../../../hooks/useUser';
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

interface SettingsThemeProps {
  theme?: ThemeModel;
  overRideTheme: (theme: ThemeModel) => void;
  defaultTheme: DefaultThemeType;
}

export const SettingsTheme: React.FC<SettingsThemeProps> = ({
  theme,
  overRideTheme,
  defaultTheme,
}) => {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const [updateTheme] = useMutation(UpdateTheme);
  const [fileUpload] = useMutation(FileUpload);

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

  useEffect(() => {
    if (theme) {
      colorSetValue('primary', theme.colors.primary);
      colorSetValue('secondary', theme.colors.secondary);
      colorSetValue('tertiary', theme.colors.tertiary);
      colorSetValue('primaryAccent1', theme.colors.primaryAccent1);
      colorSetValue('primaryAccent2', theme.colors.primaryAccent2);
      colorSetValue('secondaryAccent1', theme.colors.secondaryAccent1);
      colorSetValue('secondaryAccent2', theme.colors.secondaryAccent2);
      colorSetValue('tertiaryAccent1', theme.colors.tertiaryAccent1);
      colorSetValue('textDark', theme.colors.textDark);
      colorSetValue('textMid', theme.colors.textMid);
      colorSetValue('textLight', theme.colors.textLight);
      colorSetValue('uiMidDark', theme.colors.uiMidDark);
      colorSetValue('uiMid', theme.colors.uiMid);
      colorSetValue('uiLight', theme.colors.uiLight);
      colorSetValue('uiBg', theme.colors.uiBg);
      colorSetValue('modalBg', theme.colors.modalBg);
      colorSetValue('errorMain', theme.colors.errorMain);
      colorSetValue('errorDark', theme.colors.errorDark);
      colorSetValue('errorBg', theme.colors.errorBg);
      colorSetValue('alertMain', theme.colors.alertMain);
      colorSetValue('alertDark', theme.colors.alertDark);
      colorSetValue('alertBg', theme.colors.alertBg);
      colorSetValue('successMain', theme.colors.successMain);
      colorSetValue('successDark', theme.colors.successDark);
      colorSetValue('successBg', theme.colors.successBg);
      colorSetValue('infoMain', theme.colors.infoMain);
      colorSetValue('infoDark', theme.colors.infoDark);
      colorSetValue('infoBb', theme.colors.infoBb);

      colorSetValue('quatenary', theme.colors.quatenary);
      colorSetValue('quatenaryMain', theme.colors.quatenaryMain);
      colorSetValue('adminPortalBg', theme.colors.adminPortalBg);
      colorSetValue('darkBlue', theme.colors.darkBlue);
      colorSetValue('pointsCardBg', theme.colors.pointsCardBg);
      colorSetValue('pointsCardBarBg', theme.colors.pointsCardBarBg);
      colorSetValue('quatenaryBg', theme.colors.quatenaryBg);
      colorSetValue('adminBackground', theme.colors.adminBackground);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

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
      if (images.logoUrl) {
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
      if (images.graphicOverlayUrl) {
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
      if (images.faviconUrl) {
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

      const themeVersion = theme && theme.version ? theme.version + 1 : 1;
      const themeInputModel: ThemeModel = {
        version: themeVersion,
        colors: {
          primary: colors.primary,
          primaryAccent1: colors.primaryAccent1,
          primaryAccent2: colors.primaryAccent2,
          secondary: colors.secondary,
          secondaryAccent1: colors.secondaryAccent1,
          secondaryAccent2: colors.secondaryAccent2,
          tertiary: colors.tertiary,
          tertiaryAccent1: colors.tertiaryAccent1,
          tertiaryAccent2: colors.tertiaryAccent2,
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
            : DefaultTheme.graphicOverlayUrl,
          logoUrl: logoUrl ? logoUrl : DefaultTheme.logoUrl,
          faviconUrl: faviconUrl ? faviconUrl : DefaultTheme.faviconUrl,
          portalLoginLogoUrl: DefaultTheme.portalLoginLogoUrl,
          portalLoginBackgroundUrl: DefaultTheme.portalLoginBackgroundUrl,
        },
      };

      const themeString = JSON.stringify(themeInputModel);
      console.log(themeString);
      await updateTheme({
        variables: {
          input: themeString,
        },
      }).then(() => {
        DefaultTheme.primary = colors.primary;
        DefaultTheme.primaryAccent1 = colors.primaryAccent1;
        DefaultTheme.primaryAccent2 = colors.primaryAccent2;
        DefaultTheme.secondary = colors.secondary;
        DefaultTheme.secondaryAccent1 = colors.secondaryAccent1;
        DefaultTheme.secondaryAccent2 = colors.secondaryAccent2;
        DefaultTheme.tertiary = colors.tertiary;
        DefaultTheme.tertiaryAccent1 = colors.tertiaryAccent1;
        DefaultTheme.tertiaryAccent2 = colors.tertiaryAccent2;
        DefaultTheme.textDark = colors.textDark;
        DefaultTheme.textMid = colors.textMid;
        DefaultTheme.textLight = colors.textLight;
        DefaultTheme.uiMidDark = colors.uiMidDark;
        DefaultTheme.uiMid = colors.uiMid;
        DefaultTheme.uiLight = colors.uiLight;
        DefaultTheme.uiBg = colors.uiBg;
        DefaultTheme.modalBg = colors.modalBg;
        DefaultTheme.errorMain = colors.errorMain;
        DefaultTheme.errorDark = colors.errorDark;
        DefaultTheme.errorBg = colors.errorBg;
        DefaultTheme.alertMain = colors.alertMain;
        DefaultTheme.alertDark = colors.alertDark;
        DefaultTheme.alertBg = colors.alertBg;
        DefaultTheme.successMain = colors.successMain;
        DefaultTheme.successDark = colors.successDark;
        DefaultTheme.successBg = colors.successBg;
        DefaultTheme.infoMain = colors.infoMain;
        DefaultTheme.infoDark = colors.infoDark;
        DefaultTheme.infoBb = colors.infoBb;
        DefaultTheme.logoUrl = themeInputModel.images.logoUrl;
        DefaultTheme.graphicOverlayUrl =
          themeInputModel.images.graphicOverlayUrl;
        DefaultTheme.faviconUrl = themeInputModel.images.faviconUrl;
        DefaultTheme.fontUrl = themeInputModel.fonts.fontUrl;
        DefaultTheme.mainHeadingOverrideFontUrl =
          themeInputModel.fonts.mainHeadingOverrideFontUrl;

        setNotification({
          title: 'Successfully Updated Theme!',
          variant: NOTIFICATION.SUCCESS,
        });

        applyTheme();
        overRideTheme(themeInputModel);
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
                      contentUrl={theme?.images.graphicOverlayUrl}
                      nameProp="graphicOverlayUrl"
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
                      contentUrl={theme?.images.logoUrl}
                      label={''}
                      nameProp="logoUrl"
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
                      contentUrl={theme?.images.faviconUrl}
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
                    currentColor={theme?.colors?.primary}
                    label={''}
                    nameProp={'primary'}
                    register={colorRegister}
                    isAdminPortalField={true}
                  />
                </div>
                <div>
                  <FormColorField
                    setValue={colorSetValue}
                    currentColor={theme?.colors?.secondary}
                    label={''}
                    nameProp={'secondary'}
                    register={colorRegister}
                    isAdminPortalField={true}
                  />
                </div>
                <div>
                  <FormColorField
                    setValue={colorSetValue}
                    currentColor={theme?.colors?.tertiary}
                    label={''}
                    nameProp={'tertiary'}
                    register={colorRegister}
                    isAdminPortalField={true}
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-y-6 gap-x-4 sm:grid-cols-3">
                <p className="px-4 text-xl">Dark version (svg, png, jpeg):</p>
                <p className="px-4 text-xl">Light version (svg, png, jpeg):</p>
                <p className="px-4 text-xl">Favicon (ico):</p>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-y-6 gap-x-4 sm:grid-cols-3">
                <div>
                  <FormFileInput
                    acceptedFormats={acceptedFormats}
                    contentUrl={theme?.images.graphicOverlayUrl}
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
                    acceptedFormats={acceptedFormats}
                    contentUrl={theme?.images.logoUrl}
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
                    acceptedFormats={['ico']}
                    contentUrl={theme?.images.faviconUrl}
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
