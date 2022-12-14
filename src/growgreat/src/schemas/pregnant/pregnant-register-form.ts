import { SA_CELL_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface PregnantRegisterModel {
  name?: string;
  surname?: string;
  cellphone?: string;
  email?: string;
  hasConsent?: Object;
  address?: string;
  deliveryDate?: Date;
  maternalCaseRecord?: string;
  numberOfChildren?: number;
  age?: string;
}

export const initialPregnantFormValues: PregnantRegisterModel = {
  name: '',
  surname: '',
  cellphone: '',
  email: '',
  hasConsent: {},
  address: '',
  deliveryDate: new Date(0),
  maternalCaseRecord: '',
  numberOfChildren: 0,
  age: '',
};

export const practitionerAboutModelSchema = Yup.object().shape({
  name: Yup.string().required('First Name is required'),
  surname: Yup.string().required('Surname is required'),
  cellphone: Yup.string()
    .required('Cellphone number is required')
    .matches(SA_CELL_REGEX, 'Please enter a valid cellphone number'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  hasConsent: Yup.bool().required('You should consent the agreement!'),
  address: Yup.string().required('Address is required'),
  numberOfChildren: Yup.number(),
  age: Yup.string(),
});
