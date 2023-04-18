import * as Yup from 'yup';

export interface ChildCaregiverInformationModel {
  firstname: string;
  surname: string;
  relationId: string;
  relation: string;
  phoneNumber: string;
}

export const childCareGiverInformationSchema = Yup.object().shape({
  phoneNumber: Yup.string().required(),
});
