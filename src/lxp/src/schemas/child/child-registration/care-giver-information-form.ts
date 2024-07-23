import { SA_CELL_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface CareGiverInformationFormModel {
  firstname: string;
  surname: string;
  relationId: string;
  phoneNumber: string;
  preferId: boolean;
}

export const careGiverInformationFormSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  surname: Yup.string().required('Surname is required'),
  relationId: Yup.string().required(),
  phoneNumber: Yup.string()
    .required()
    .matches(SA_CELL_REGEX, 'Please enter a valid cell number'),
});
