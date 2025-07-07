import * as Yup from 'yup';

export const initialContentValues = {
  name: '',
  languageLocale: '',
};

export const contentSchema = Yup.object().shape({
  name: Yup.string(),
});
