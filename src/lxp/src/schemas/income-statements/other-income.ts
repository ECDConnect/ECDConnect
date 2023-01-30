import * as Yup from 'yup';

export interface OtherIncomeModel {
  date: Date | string;
  incomeAmount: string;
  description: string;
  note?: string;
}

export const otherIncomeSchema = Yup.object().shape({
  date: Yup.date().required(),
  description: Yup.string().required(),
  incomeAmount: Yup.string().required(),
  note: Yup.string(),
});
