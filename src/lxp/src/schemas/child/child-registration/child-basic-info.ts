import * as Yup from 'yup';

export interface ChildBasicInfoModel {
  firstName: string;
  surname: string;
  playgroupId: string;
}

export const childBasicInfoFormSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  surname: Yup.string().required(),
  playgroupId: Yup.string().required(),
});
