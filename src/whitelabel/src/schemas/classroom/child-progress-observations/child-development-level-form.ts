import * as Yup from 'yup';

export interface ChildDevelopmentLevelFormModel {
  practitionerAgreeToLevel?: boolean;
  levelId: number;
}

export const childDevelopmentLevelFormSchema = Yup.object().shape({
  practitionerAgreeToLevel: Yup.boolean().required(),
  levelId: Yup.number().required(),
});
