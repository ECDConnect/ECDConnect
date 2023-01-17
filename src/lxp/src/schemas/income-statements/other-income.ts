import * as Yup from 'yup';

export interface OtherIncomeModel {
  date: Date | string;
  incomeAmount: number;
  description: string;
  note?: string;
}

export const otherIncomeSchema = Yup.object().shape({
  date: Yup.date().required(),
  description: Yup.string().required(),
  incomeAmount: Yup.number().required(),
  note: Yup.string(),
});
