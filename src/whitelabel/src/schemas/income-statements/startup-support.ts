import * as Yup from 'yup';

export interface StartupSupportModel {
  date: Date | string;
  startupValue: string;
}

export const StartupSupportSchema = Yup.object().shape({
  date: Yup.date().required(),
  startupValue: Yup.string().required(),
});
