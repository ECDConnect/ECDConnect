import { SA_CELL_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface PractitionerAboutModel {
  name: string;
  surname: string;
  cellphone: string;
  email: string;
  whatsapp?: string;
  usePhotoInReport?: string | null;
}

export const initialPractitionerAboutValues: PractitionerAboutModel = {
  name: '',
  surname: '',
  cellphone: '',
  email: '',
  whatsapp: '',
  usePhotoInReport: null,
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
  whatsapp: Yup.string().matches(
    SA_CELL_REGEX,
    'Please enter a valid whatsapp number'
  ),
});
