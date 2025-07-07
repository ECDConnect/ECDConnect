import * as Yup from 'yup';

export interface ChildLearningSupportFormModel {
  learningSupport?: string;
}

export const childLearningSupportFormSchema = Yup.object().shape({
  learningSupport: Yup.string().required(),
});
