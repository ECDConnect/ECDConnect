import * as Yup from 'yup';

export interface ChildExtraInformationFormModel {
  genderId?: string;
  childFirstname: string;
  homeLanguages?: string[];
  otherLanguages?: string;
}

export const childExtraInformationFormSchema = Yup.object().shape({
  genderId: Yup.string(),
  homeLanguages: Yup.array(),
});
