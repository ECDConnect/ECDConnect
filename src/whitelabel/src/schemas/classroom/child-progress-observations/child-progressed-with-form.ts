import * as Yup from 'yup';

export interface ChildProgressedWithFormModel {
  childProgressedWith: string;
}

export const childProgressedWithFormSchema = Yup.object().shape({
  childProgressedWith: Yup.string().required(),
});
