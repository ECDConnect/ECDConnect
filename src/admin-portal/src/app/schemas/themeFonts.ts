import * as Yup from 'yup';

export interface ThemeFonts {
  fontUrl: string | undefined;
  mainHeadingOverrideFontUrl: string | undefined;
}

export const initialThemeFonts: ThemeFonts = {
  fontUrl: '',
  mainHeadingOverrideFontUrl: '',
};

export const themeFontsScheme = Yup.object().shape({
  fontUrl: Yup.string(),
  mainHeadingOverrideFontUrl: Yup.string(),
});
