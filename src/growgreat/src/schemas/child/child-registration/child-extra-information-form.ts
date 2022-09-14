import * as Yup from 'yup';

export interface ChildExtraInformationFormModel {
  race?: string;
  genderId?: string;
  childFirstname: string;
  homeLanguages?: string[];
  otherLanguages?: string;
}

export const childExtraInformationFormSchema = Yup.object().shape({
  race: Yup.string().required(),
  genderId: Yup.string().required(),
  homeLanguages: Yup.array().required().min(1),
});
