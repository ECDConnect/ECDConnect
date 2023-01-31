import * as Yup from 'yup';

export interface PreschoolFeesModel {
  date: Date | string;
  child: any;
  contributionType: any;
  feeType: string | string[];
  note: string;
  amount: number;
}

export const preschoolFeesSchema = Yup.object().shape({
  date: Yup.date().required(),
  practitioner: Yup.string().required(),
  contributionType: Yup.string(),
  feeType: Yup.string(),
  amount: Yup.number(),
  note: Yup.string(),
});
