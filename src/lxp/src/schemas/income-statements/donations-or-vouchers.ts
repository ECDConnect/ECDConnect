import * as Yup from 'yup';

export interface DonationsOrVouchersModel {
  dateReceived: string;
  payType: string;
  description: string;
  amount: string;
  notes: string;
}

export const donationsOrVouchersSchema = Yup.object().shape({
  dateReceived: Yup.string().required(),
  payType: Yup.string().required(),
  description: Yup.string(),
  amount: Yup.string().required(),
  notes: Yup.string(),
});
