import { SA_CELL_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface CoachAboutModel {
  name: string;
  surname: string;
  cellphone: string;
  email: string;
  signature?: string;
  addressName?: string;
  apartmentNumber?: string;
  streetAddress: string;
  suburb: string;
  city: string;
  provinceId: string;
  postalCode?: string;
}

export const initialCoachAboutValues: CoachAboutModel = {
  name: '',
  surname: '',
  cellphone: '',
  email: '',
  signature: '',
  addressName: '',
  apartmentNumber: '',
  streetAddress: '',
  suburb: '',
  city: '',
  provinceId: '',
  postalCode: '',
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
  signature: Yup.string().optional(),
  addressName: Yup.string().optional(),
  apartmentNumber: Yup.string().optional(),
  streetAddress: Yup.string().required('Street address is required'),
  suburb: Yup.string().required('Suburb is required'),
  city: Yup.string().required('City is required'),
  provinceId: Yup.string().required('Please select a province'),
  postalCode: Yup.string().required('Postal code is required'),
});
