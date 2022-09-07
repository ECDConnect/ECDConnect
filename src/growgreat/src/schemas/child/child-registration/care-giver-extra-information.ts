import * as Yup from 'yup';

export interface CareGiverExtraInformationFormModel {
  highestEducationId: string;
  familyGrants: string[];
}

export const careGiverExtraInformationFormSchema = Yup.object().shape({
  highestEducationId: Yup.string().required(),
  familyGrants: Yup.array().required().min(1),
});
