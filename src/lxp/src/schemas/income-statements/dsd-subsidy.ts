import * as Yup from 'yup';

export interface DsdSubsidyModel {
  date: Date | string;
  childrenNumber: number;
  subsidyAmount: string;
  note?: string;
}

export const dsdSubsidySchema = Yup.object().shape({
  date: Yup.date().required(),
  childrenNumber: Yup.number().required(),
  subsidyAmount: Yup.string().required(),
  note: Yup.string(),
});
