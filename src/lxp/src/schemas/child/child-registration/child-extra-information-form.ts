import * as Yup from 'yup';

export interface ChildExtraInformationFormModel {
  genderId?: string;
  childFirstname: string;
  homeLanguageIds?: string[];
  otherLanguages?: string;
}

export const childExtraInformationFormSchema = Yup.object().shape({
  genderId: Yup.string(),
  homeLanguageIds: Yup.array(),
  otherLanguages: Yup.string(),
});
