import { SA_CELL_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface CoachAboutModel {
  name: string;
  surname: string;
  cellphone: string;
  email: string;
  signingSignature?: string;
  address?: string;
}

export const initialCoachAboutValues: CoachAboutModel = {
  name: '',
  surname: '',
  cellphone: '',
  email: '',
  signingSignature: '',
  address: '',
};

export const coachAboutModelSchema = Yup.object().shape({
  name: Yup.string().required('First Name is required'),
  surname: Yup.string().required('Surname is required'),
  cellphone: Yup.string()
    .required('Cellphone number is required')
    .matches(SA_CELL_REGEX, 'Please enter a valid cellphone number'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  signingSignature: Yup.string().optional(),
  address: Yup.string().optional(),
});
