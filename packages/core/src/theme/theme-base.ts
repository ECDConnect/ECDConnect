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
  quinary: string;
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
  primary: '#27385A',
  primaryAccent1: '#52607B',
  primaryAccent2: '#D4D7DE',
  secondary: '#FF2180',
  secondaryAccent1: '#FF90BF',
  secondaryAccent2: '#FFD3E6',
  tertiary: '#83BB26',
  tertiaryAccent1: '#C1DD92',
  tertiaryAccent2: '#E6F1D4',
  textDark: '#27385A',
  textMid: '#65727A',
  textLight: '#C9CFD2',
  uiMidDark: '#5e557a',
  uiMid: '#827c93',
  uiLight: '#cac5d8',
  uiBg: '#EFF6FA',
  modalBg: '#667289',
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
  quinary: '#FFD525',
};

export const DefaultTheme: DefaultThemeType = {
  primary: '#27385A',
  primaryAccent1: '#52607B',
  primaryAccent2: '#D4D7DE',
  secondary: '#FF2180',
  secondaryAccent1: '#FF90BF',
  secondaryAccent2: '#FFD3E6',
  tertiary: '#83BB26',
  tertiaryAccent1: '#C1DD92',
  tertiaryAccent2: '#E6F1D4',
  textDark: '#27385A',
  textMid: '#65727A',
  textLight: '#C9CFD2',
  uiMidDark: '#5e557a',
  uiMid: '#827c93',
  uiLight: '#cac5d8',
  uiBg: '#EFF6FA',
  modalBg: '#667289',
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
  quinary: '#FFD525',
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
