import * as Yup from 'yup';

export interface OtherIncomeModel {
  dateReceived: string;
  amount: string;
  notes?: string;
}

export const otherIncomeSchema = Yup.object().shape({
  dateReceived: Yup.string().required(),
  amount: Yup.string().required(),
  notes: Yup.string(),
});
