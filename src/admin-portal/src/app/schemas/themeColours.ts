import * as Yup from 'yup';

export interface ThemeColours {
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
}

export const initialThemeColours: ThemeColours = {
  primary: '#583f99',
  secondary: '#ed145b',
  tertiary: '#00c0f3',
  textDark: '#1f192e',
  textMid: '#483e63',
  textLight: '#635b74',
  uiMidDark: '#5e557a',
  uiMid: '#827c93',
  uiLight: '#cac5d8',
  uiBg: '#f3f1f9'
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
  uiBg: Yup.string().required()
});
