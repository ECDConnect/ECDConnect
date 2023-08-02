import { SA_CELL_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface ChildCaregiverInformationModel {
  firstname: string;
  surname: string;
  relationId: string;
  relation: string;
  phoneNumber: string;
}

export const childCareGiverInformationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(SA_CELL_REGEX, 'Please enter a valid cell number'),
});
