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
  primaryAccent1: string;
  primaryAccent2: string;
  secondary: string;
  secondaryAccent1: string;
  secondaryAccent2: string;
  tertiary: string;
  tertiaryAccent1: string;
  tertiaryAccent2: string;
  textDark: string;
  textMid: string;
  textLight: string;
  uiMidDark: string;
  uiMid: string;
  uiLight: string;
  uiBg: string;
  modalBg: string;
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
  quatenary: string;
  quatenaryMain: string;
  adminPortalBg: string;
  darkBlue: string;
  pointsCardBg: string;
  pointsCardBarBg: string;
  quatenaryBg: string;
  adminBackground: string;
  quinary: string;
}
