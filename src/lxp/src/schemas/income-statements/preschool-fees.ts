import * as Yup from 'yup';

export interface PreschoolFeesModel {
  date: string;
  child: any;
  contributionType: any;
  feeType: string | string[];
  note: string;
  amount: string;
}

export const preschoolFeesSchema = Yup.object().shape({
  date: Yup.string().required(),
  practitioner: Yup.string().required(),
  contributionType: Yup.string(),
  feeType: Yup.string(),
  amount: Yup.number(),
  note: Yup.string(),
});
