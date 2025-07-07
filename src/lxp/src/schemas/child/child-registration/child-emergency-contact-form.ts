import { SA_CELL_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface ChildEmergencyContactFormModel {
  firstname: string;
  surname: string;
  phoneNumber: string;
  isAllowedCustody: boolean;
  custodianFirstname: string;
  custodianSurname: string;
  custodianPhoneNumber: string;
}

export const childEmergencyContactFormSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  surname: Yup.string().required('Surname is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(SA_CELL_REGEX, 'Please enter a valid cell number'),
  isAllowedCustody: Yup.boolean().required(),
  custodianFirstname: Yup.string().when('isAllowedCustody', {
    is: false,
    then: Yup.string().required('First name is required'),
  }),
  custodianSurname: Yup.string().when('isAllowedCustody', {
    is: false,
    then: Yup.string().required('Surname is required'),
  }),
  custodianPhoneNumber: Yup.string().when('isAllowedCustody', {
    is: false,
    then: Yup.string()
      .required('Phone number is required')
      .matches(SA_CELL_REGEX, 'Please enter a valid cell number'),
  }),
});
