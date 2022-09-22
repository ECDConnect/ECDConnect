import * as Yup from 'yup';

export interface ReassignClassModel {
  date: Date | string;
  practitioner: any;
  practitioner2: any;
  reason: any;
  reassignedClass: string;
}

export const reassignClassSchema = Yup.object().shape({
  date: Yup.date().required(),
  practitioner: Yup.string().required(),
  practitioner2: Yup.string().required(),
  reason: Yup.string(),
  reassignedClass: Yup.string(),
});
