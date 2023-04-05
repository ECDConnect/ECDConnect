import * as Yup from 'yup';

const expression = new RegExp('(test)=(A:([0-9.]*))', 'g');

export interface DonationsOrVouchersModel {
  date: Date | string;
  donations: string[];
  donationWorth: string;
  note: string;
}

export const donationsOrVouchersSchema = Yup.object().shape({
  date: Yup.date().required(),
  donations: Yup.string().required(),
  donationWorth: Yup.string(),
  note: Yup.string(),
});
