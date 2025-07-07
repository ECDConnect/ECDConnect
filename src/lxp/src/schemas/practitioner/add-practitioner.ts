import { SA_ID_REGEX, SA_PASSPORT_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface AddPractitionerModel {
  id?: string;
  userId?: string;
  idNumber: string;
  passport: string;
  firstName: string;
  surname?: string;
  preferId: boolean;
  phoneNumber?: string;
}

export const initialAddPractitionerValues: AddPractitionerModel = {
  firstName: '',
  surname: '',
  preferId: true,
  idNumber: '',
  passport: '',
  phoneNumber: '',
};

export const setupPractitioner = Yup.object().shape({
  practitionerToProgramme: Yup.boolean().required(),
  allowPermissions: Yup.mixed().oneOf([true]).required(),
});

export const addPractitionerSchema = Yup.object().shape({
  idNumber: Yup.string().when('preferId', {
    is: true,
    then: Yup.string()
      .required('ID number is required')
      .matches(SA_ID_REGEX, 'Please enter a valid ID number'),
  }),
  passport: Yup.string().when('preferId', {
    is: false,
    then: Yup.string()
      .required('Passport number is required')
      .matches(SA_PASSPORT_REGEX, 'Please enter a valid Passport number'),
  }),
});
