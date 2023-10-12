import * as Yup from 'yup';
export interface DsdSubsidyModel {
  date: string;
  childrenNumber: number;
  subsidyAmount: string;
  note?: string;
}

export const dsdSubsidySchema = Yup.object().shape({
  date: Yup.string().required(),
  childrenNumber: Yup.number().required().integer().positive().max(100),
  subsidyAmount: Yup.number().required(),
  note: Yup.string(),
});
