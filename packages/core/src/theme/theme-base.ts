export type DefaultThemeType = {
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
  logoUrl: string;
  graphicOverlayUrl: string;
  faviconUrl: string;
  portalLoginLogoUrl: string;
  portalLoginBackgroundUrl: string;
  fontUrl: string;
  mainHeadingOverrideFontUrl: string;
  darkBackground: string;
};

export type DefaultThemeColors = Omit<
  DefaultThemeType,
  | 'graphicOverlayUrl'
  | 'faviconUrl'
  | 'portalLoginLogoUrl'
  | 'portalLoginBackgroundUrl'
  | 'fontUrl'
  | 'mainHeadingOverrideFontUrl'
  | 'logoUrl'
>;

// TODO: (Tenancy) these values can't be hardcoded
export const WhiteLabelTheme: DefaultThemeType = {
  primary: '#583f99',
  primaryAccent1: '#9484BD',
  primaryAccent2: '#D7D1E6',
  secondary: '#00B0E0',
  secondaryAccent1: '#66D0EC',
  secondaryAccent2: '#C2ECF8',
  tertiary: '#ED145B',
  tertiaryAccent1: '#F4729D',
  tertiaryAccent2: '#FBC7D8',
  textDark: '#1F192E',
  textMid: '#483E63',
  textLight: '#9B96A6',
  uiMidDark: '#5e557a',
  uiMid: '#827c93',
  uiLight: '#cac5d8',
  uiBg: '#F3F1F9',
  modalBg: '#cac5d8',
  errorMain: '#ED1414',
  errorDark: '#D20000',
  errorBg: '#FFEEF6',
  alertMain: '#FF5C00',
  alertDark: '#E43802',
  alertBg: '#FFEEE4',
  successMain: '#83BB26',
  successDark: '#5A8F02',
  successBg: '#E6F1D4',
  infoMain: '#1D67D5',
  infoDark: '#1752AB',
  infoBb: '#EBF3FF',
  logoUrl: '',
  graphicOverlayUrl: '',
  faviconUrl: '',
  portalLoginLogoUrl: '',
  portalLoginBackgroundUrl: '',
  fontUrl: 'Quicksand, sans-serif',
  mainHeadingOverrideFontUrl: 'Inter, sans-serif',
  darkBackground: '#27385A',
  quatenary: '#1DBADF',
  quatenaryMain: '#1DBADF',
  adminPortalBg: '#EFF6FA',
  darkBlue: '#27385A',
  pointsCardBg: '#FEEED7',
  pointsCardBarBg: '#FCCF8C',
  quatenaryBg: '#D2F1F9',
  adminBackground: '#EFF6FA',
};

export const DefaultTheme: DefaultThemeType = {
  primary: '#583f99',
  primaryAccent1: '#9484BD',
  primaryAccent2: '#D7D1E6',
  secondary: '#00b0e0',
  secondaryAccent1: '#66D0EC',
  secondaryAccent2: '#C2ECF8',
  tertiary: '#ed145b',
  tertiaryAccent1: '#F4729D',
  tertiaryAccent2: '#FBC7D8',
  textDark: '#1f192e',
  textMid: '#483e63',
  textLight: '#635b74',
  uiMidDark: '#5e557a',
  uiMid: '#827c93',
  uiLight: '#cac5d8',
  uiBg: '#f3f1f9',
  modalBg: '#cac5d8',
  errorMain: '#e74035',
  errorDark: '#99231b',
  errorBg: '#fef2f2',
  alertMain: '#ff8a1d',
  alertDark: '#cf6e14',
  alertBg: '#fff0e3',
  successMain: '#50b848',
  successDark: '#267220',
  successBg: '#e5f4e3',
  infoMain: '#1d67d5',
  infoDark: '#1752ab',
  infoBb: '#d8e7ff',
  logoUrl: '',
  graphicOverlayUrl: '',
  faviconUrl: '',
  portalLoginLogoUrl: '',
  portalLoginBackgroundUrl: '',
  fontUrl: 'Quicksand, sans-serif',
  mainHeadingOverrideFontUrl: 'Inter, sans-serif',
  darkBackground: '#27385A',
  quatenary: '#1DBADF',
  quatenaryMain: '#1DBADF',
  adminPortalBg: '#EFF6FA',
  darkBlue: '#27385A',
  pointsCardBg: '#FEEED7',
  pointsCardBarBg: '#FCCF8C',
  quatenaryBg: '#D2F1F9',
  adminBackground: '#EFF6FA',
};

export const DefaultAvatarColors = [
  '#d3276c',
  '#b83a7d',
  '#9e4d8e',
  '#84609f',
  '#6974af',
  '#4f87c0',
  '#359ad1',
  '#1aade2',
];

export const DefaultAvatarColorsGG = ['#26ACAF', '#FAAB35', '#F47C24'];
