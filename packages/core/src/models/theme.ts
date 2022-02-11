export interface ThemeModel {
  version: number;
  images: ThemeImagesModel;
  fonts: ThemeFontsModel;
  colors: ThemeColorsModel;
}

export interface ThemeImagesModel {
  logoUrl: string;
  graphicOverlayUrl: string;
  faviconUrl: string;
  portalLoginLogoUrl: string;
  portalLoginBackgroundUrl: string;
}

export interface ThemeFontsModel {
  fontUrl: string;
  mainHeadingOverrideFontUrl: string;
}

export interface ThemeColorsModel {
  primary: string;
  secondary: string;
  tertiary: string;
  textDark: string;
  textMid: string;
  textLight: string;
  uiMidDark: string;
  uiMid: string;
  uiLight: string;
  uiBg: string;
  errorMain: string;
  errorDark: string;
  errorBg: string;
  alertMain: string;
  alertDark: string;
  alertBg: string;
  successMain: string;
  successDark: string;
  successBg: string;
  infoMain: string;
  infoDark: string;
  infoBb: string;
}
