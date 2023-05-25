import * as Yup from 'yup';
const digitsOnly = (value: any) => /^\d+$/.test(value);
export interface DsdSubsidyModel {
  date: Date | string;
  childrenNumber: number;
  subsidyAmount: string;
  note?: string;
}

export const dsdSubsidySchema = Yup.object().shape({
  date: Yup.date().required(),
  childrenNumber: Yup.number().required().integer().positive().max(100),
  subsidyAmount: Yup.string().required(),
  note: Yup.string(),
});
