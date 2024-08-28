import * as Yup from 'yup';
import { DefaultThemeColors } from '@ecdlink/core';

export interface ThemeColours extends DefaultThemeColors {
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
  darkBackground: string;
  quatenary: string;
  quatenaryMain: string;
  adminPortalBg: string;
  darkBlue: string;
  pointsCardBg: string;
  pointsCardBarBg: string;
  quatenaryBg: string;
  adminBackground: string;
}

//TODO: (Tenancy) we can't have these hardcoded for multiple tenenats
export const initialThemeColours: ThemeColours = {
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
  darkBackground: 'red',
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

export const themeColoursScheme = Yup.object().shape({
  primary: Yup.string().required(),
  secondary: Yup.string().required(),
  tertiary: Yup.string().required(),
  textDark: Yup.string().required(),
  textMid: Yup.string().required(),
  textLight: Yup.string().required(),
  uiMidDark: Yup.string().required(),
  uiMid: Yup.string().required(),
  uiLight: Yup.string().required(),
  uiBg: Yup.string().required(),
  darkBackground: Yup.string().required(),
});
