import * as Yup from 'yup';

export interface ExpensesModel {
  date?: Date | string;
  amount: string;
  expenseInvoice?: string;
  note?: string;
}

export const expensesSchema = Yup.object().shape({
  date: Yup.date().required('Delivery date is required'),
  amount: Yup.string().required('Value is required'),
  expenseInvoice: Yup.string(),
  note: Yup.string(),
});
