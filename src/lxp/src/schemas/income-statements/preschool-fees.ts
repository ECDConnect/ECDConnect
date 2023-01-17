import * as Yup from 'yup';

export interface PreschoolFeesModel {
  date: Date | string;
  child: any;
  contributionType: any;
  grants: string[];
  note: string;
}

export const preschoolFeesSchema = Yup.object().shape({
  date: Yup.date().required(),
  practitioner: Yup.string().required(),
  contributionType: Yup.string(),
  grants: Yup.string(),
  note: Yup.string(),
});
