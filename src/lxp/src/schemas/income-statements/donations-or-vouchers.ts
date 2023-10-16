import * as Yup from 'yup';

export interface DonationsOrVouchersModel {
  date: string;
  donations: string[];
  donationWorth: string;
  note: string;
}

export const donationsOrVouchersSchema = Yup.object().shape({
  date: Yup.string().required(),
  donations: Yup.string().required(),
  donationWorth: Yup.number(),
  note: Yup.string(),
});
