import * as Yup from 'yup';

export interface ChildHealthInformationFormModel {
  allergies?: string;
  disabilities?: string;
  healthConditions?: string;
}

export const childHealthInformationFormSchema = Yup.object().shape({
  allergies: Yup.string(),
  disabilities: Yup.string(),
  healthConditions: Yup.string(),
});
