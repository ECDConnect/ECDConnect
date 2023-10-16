import * as Yup from 'yup';

export interface OtherIncomeModel {
  date: string;
  incomeAmount: string;
  description: string;
  note?: string;
}

export const otherIncomeSchema = Yup.object().shape({
  date: Yup.string().required(),
  description: Yup.string().required(),
  incomeAmount: Yup.number().required(),
  note: Yup.string(),
});
