import { SA_ID_REGEX, SA_PASSPORT_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface LoginModel {
  preferId: boolean;
  idField: string;
  passportField: string;
  password: string;
}

export const initialLoginValues: LoginModel = {
  preferId: true,
  idField: '',
  passportField: '',
  password: '',
};

export const loginSchema = Yup.object().shape({
  idField: Yup.string().when('preferId', {
    is: true,
    then: Yup.string()
      .required('ID number is required')
      .matches(SA_ID_REGEX, 'Please enter a valid ID number'),
  }),
  passportField: Yup.string().when('preferId', {
    is: false,
    then: Yup.string()
      .required('Passport number is required')
      .matches(SA_PASSPORT_REGEX, 'Please enter a valid Passport number'),
  }),
  password: Yup.string().required().min(8, 'At least 8 characters'),
});
