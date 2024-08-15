import * as Yup from 'yup';

export interface ExpensesModel {
  datePaid?: string;
  amount?: string;
  photoProof?: string;
  notes?: string;
}

export const expensesSchema = Yup.object().shape({
  datePaid: Yup.date().required('Delivery date is required'),
  amount: Yup.string().strict().required('Value is required'),
});
