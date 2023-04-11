import { SA_CELL_REGEX, SA_ID_REGEX, SA_PASSPORT_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface CareGiverInformationFormModel {
  firstname: string;
  surname: string;
  relationId: string;
  careGiverIdField: string;
  careGiverPassportField: string;
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
  careGiverIdField: Yup.string().when('preferId', {
    is: true,
    then: Yup.string()
      .required('ID number is required')
      .matches(SA_ID_REGEX, 'Please enter a valid ID number'),
  }),
  careGiverPassportField: Yup.string().when('preferId', {
    is: false,
    then: Yup.string()
      .required('Passport number is required')
      .matches(SA_PASSPORT_REGEX, 'Please enter a valid passport number'),
  }),
});
