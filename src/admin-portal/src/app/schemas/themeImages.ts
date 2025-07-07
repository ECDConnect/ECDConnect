import { FileModel } from '@ecdlink/core';
import * as Yup from 'yup';

export interface ThemeImages {
  logoUrl: FileModel | undefined;
  graphicOverlayUrl: FileModel | undefined;
  faviconUrl: FileModel | undefined;
  portalLoginLogoUrl: FileModel | undefined;
  portalLoginBackgroundUrl: FileModel | undefined;
}

export const initialThemeImages: ThemeImages = {
  logoUrl: undefined,
  graphicOverlayUrl: undefined,
  faviconUrl: undefined,
  portalLoginLogoUrl: undefined,
  portalLoginBackgroundUrl: undefined,
};

export const themeImagesScheme = Yup.object().shape({
  logoUrl: Yup.mixed(),
  graphicOverlayUrl: Yup.mixed(),
  faviconUrl: Yup.mixed(),
  portalLoginLogoUrl: Yup.mixed(),
  portalLoginBackgroundUrl: Yup.mixed(),
});
