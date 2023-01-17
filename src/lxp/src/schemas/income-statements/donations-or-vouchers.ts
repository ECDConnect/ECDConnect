import * as Yup from 'yup';

export interface DonationsOrVouchersModel {
  date: Date | string;
  donations: string[];
  donationWorth: number;
  note: string;
}

export const donationsOrVouchersSchema = Yup.object().shape({
  date: Yup.date().required(),
  donations: Yup.string().required(),
  donationWorth: Yup.number(),
  note: Yup.string(),
});
