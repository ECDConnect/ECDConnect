import * as Yup from 'yup';

export interface StartupSupportModel {
  date: string;
  startupValue: string;
}

export const StartupSupportSchema = Yup.object().shape({
  date: Yup.string().required(),
  startupValue: Yup.number().required(),
});
