import * as Yup from 'yup';

export interface ExpensesModel {
  date?: string;
  amount: string;
  expenseInvoice?: string;
  note?: string;
  typeDescription?: string;
}

export const expensesSchema = Yup.object().shape({
  date: Yup.date().required('Delivery date is required'),
  amount: Yup.string().strict().required('Value is required'),
  expenseInvoice: Yup.string(),
  note: Yup.string(),
  typeDescription: Yup.string(),
});
