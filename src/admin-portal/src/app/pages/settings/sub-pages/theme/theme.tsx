import { useMutation } from '@apollo/client';
import {
  applyTheme,
  DefaultTheme,
  NOTIFICATION,
  PermissionEnum,
  ThemeModel,
  useNotifications,
  useTheme,
  WhiteLabelTheme,
} from '@ecdlink/core';
import { FileTypeEnum, FileUpload, UpdateTheme } from '@ecdlink/graphql';
import { Typography } from '@ecdlink/ui';
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
import { ColoursForm } from './components/colours-form/colours-form';
import { FontsForm } from './components/fonts-form/fonts-form';
import { ImagesForm } from './components/images-form/images-form';

export function Theme() {
  const { hasPermission } = useUser();
  const { setNotification } = useNotifications();
  const { overRideTheme, setWhiteLabelTheme, theme } = useTheme();
  const [updateTheme] = useMutation(UpdateTheme);
  const [fileUpload] = useMutation(FileUpload);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (DefaultTheme) {
      initialThemeColours.primary = DefaultTheme.primary;
      initialThemeColours.secondary = DefaultTheme.secondary;
      initialThemeColours.tertiary = DefaultTheme.tertiary;
      initialThemeColours.textDark = DefaultTheme.textDark;
      initialThemeColours.textLight = DefaultTheme.textLight;
      initialThemeColours.textMid = DefaultTheme.textMid;
      initialThemeColours.uiBg = DefaultTheme.uiBg;
      initialThemeColours.uiLight = DefaultTheme.uiLight;
      initialThemeColours.uiMid = DefaultTheme.uiMid;
      initialThemeColours.uiMidDark = DefaultTheme.uiMidDark;
      initialThemeFonts.fontUrl = DefaultTheme.fontUrl;
      initialThemeFonts.mainHeadingOverrideFontUrl =
        DefaultTheme.mainHeadingOverrideFontUrl;
      initialThemeColours.darkBackground = DefaultTheme.darkBackground;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DefaultTheme]);

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
  const { isValid: colorValid } = colorFormState;

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
    if (fontsRegister) {
      fontsSetValue('fontUrl', WhiteLabelTheme.fontUrl);
      fontsSetValue(
        'mainHeadingOverrideFontUrl',
        WhiteLabelTheme.mainHeadingOverrideFontUrl
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

      let portalLoginLogoUrl = '';
      if (images.portalLoginLogoUrl) {
        await fileUpload({
          variables: {
            file: images.portalLoginLogoUrl.file,
            fileName: images.portalLoginLogoUrl.fileName,
            fileType: FileTypeEnum.Theme,
          },
        }).then((result) => {
          if (result && result.data) {
            portalLoginLogoUrl = result.data.fileUpload.url;
          }
        });
      }

      let portalLoginBackgroundUrl = '';
      if (images.portalLoginBackgroundUrl) {
        await fileUpload({
          variables: {
            file: images.portalLoginBackgroundUrl.file,
            fileName: images.portalLoginBackgroundUrl.fileName,
            fileType: FileTypeEnum.Theme,
          },
        }).then((result) => {
          if (result && result.data) {
            portalLoginBackgroundUrl = result.data.fileUpload.url;
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
            : DefaultTheme.graphicOverlayUrl,
          logoUrl: logoUrl ? logoUrl : DefaultTheme.logoUrl,
          faviconUrl: faviconUrl ? faviconUrl : DefaultTheme.faviconUrl,
          portalLoginLogoUrl: portalLoginLogoUrl
            ? portalLoginLogoUrl
            : DefaultTheme.portalLoginLogoUrl,
          portalLoginBackgroundUrl: portalLoginBackgroundUrl
            ? portalLoginBackgroundUrl
            : DefaultTheme.portalLoginBackgroundUrl,
        },
      };

      const themeString = JSON.stringify(themeInputModel);
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

    setLoading(false);
  };

  const resetTheme = () => {
    colorSetValue('primary', WhiteLabelTheme.primary);
    colorSetValue('secondary', WhiteLabelTheme.secondary);
    colorSetValue('tertiary', WhiteLabelTheme.tertiary);
    colorSetValue('textDark', WhiteLabelTheme.textDark);
    colorSetValue('textLight', WhiteLabelTheme.textLight);
    colorSetValue('textMid', WhiteLabelTheme.textMid);
    colorSetValue('uiBg', WhiteLabelTheme.uiBg);
    colorSetValue('uiLight', WhiteLabelTheme.uiLight);
    colorSetValue('uiMid', WhiteLabelTheme.uiMid);
    colorSetValue('uiMidDark', WhiteLabelTheme.uiMidDark);
    fontsSetValue('fontUrl', WhiteLabelTheme.fontUrl);
    fontsSetValue(
      'mainHeadingOverrideFontUrl',
      WhiteLabelTheme.mainHeadingOverrideFontUrl
    );
    setWhiteLabelTheme();
  };
  if (!loading) {
    return (
      <div>
        <div className="flex">
          <Typography type={'h2'} color={'white'} text="Colours" />

          {hasPermission(PermissionEnum.update_system) && (
            <div className="sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="justify-stretch flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => resetTheme()}
                  className="bg-uiMid hover:bg-uiLight focus:outline-none ml-3 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                >
                  Reset Theme
                </button>
              </div>
              <div className="justify-stretch flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => saveTheme()}
                  className="bg-uiMid hover:bg-uiLight focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                >
                  Save Theme
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-uiBg mt-2 rounded-lg border-b border-gray-200 px-4 py-5">
          <ColoursForm
            getValues={colorGetValues}
            setValue={colorSetValue}
            register={colorRegister}
          />
        </div>
        <div className="mt-6 flex pb-4">
          <Typography
            type={'h2'}
            color={'white'}
            text="Images: Accepted extensions are '.png, .svg'"
          />
        </div>
        <div className="bg-uiBg mt-2 rounded-lg border-b border-gray-200 px-4 py-5">
          <ImagesForm
            getValues={imagesGetValues}
            setValue={imagesSetValue}
            register={imagesRegister}
          />
        </div>
        <div className="mt-6 flex pb-4">
          <Typography type={'h2'} color={'white'} text="Google fonts:" />
        </div>
        <div className="bg-uiBg mt-2 rounded-lg border-b border-gray-200 px-4 py-5">
          <FontsForm
            getValues={fontsGetValues}
            setValue={fontsSetValue}
            register={fontsRegister}
          />
        </div>
      </div>
    );
  } else {
    return <ContentLoader />;
  }
}

export default Theme;
