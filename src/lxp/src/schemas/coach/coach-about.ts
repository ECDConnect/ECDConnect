import { SA_CELL_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface CoachAboutModel {
  name: string;
  surname: string;
  cellphone: string;
  email: string;
  signature?: string;
  // siteAddress: {
  //   name?: string;
  //   apartmentNumber?: string;
  //   streetAddress: string;
  //   suburb: string;
  //   city: string;
  //   provinceId: string;
  //   postalCode?: string;
  // };
}

export const initialCoachAboutValues: CoachAboutModel = {
  name: '',
  surname: '',
  cellphone: '',
  email: '',
  signature: '',
  // siteAddress: {
  //   name: '',
  //   apartmentNumber: '',
  //   streetAddress: '',
  //   suburb: '',
  //   city: '',
  //   provinceId: '',
  //   postalCode: '',
  // }
};

// const coachAddressModelSchema = Yup.object().shape({
//   name: Yup.string().required(),
//   apartmentNumber: Yup.string().optional(),
//   streetAddress: Yup.string().required('Street address is required'),
//   suburb: Yup.string().required('Suburb is required'),
//   city: Yup.string().required('City is required'),
//   provinceId: Yup.string().required('Please select a province'),
//   postalCode: Yup.string().optional(),
// });

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
  // siteAddress: coachAddressModelSchema
});
