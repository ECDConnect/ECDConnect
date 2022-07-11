import * as Yup from 'yup';

export interface EditProfileModel {
  email: string;
  isOfficeAddress: boolean;
  apartmentNumber: string;
  streetAddress: string;
  suburb: string;
  city: string;
  provinceId: string;
  postalCode: string;
}

export const editProfileSchema = Yup.object().shape({
  email: Yup.string().required(),
  isOfficeAddress: Yup.boolean().required(),
  apartmentNumber: Yup.string().optional(),
  streetAddress: Yup.string().required('Street address is required'),
  suburb: Yup.string().required('Suburb is required'),
  city: Yup.string().required('City is required'),
  provinceId: Yup.string().required('Please select a province'),
  postalCode: Yup.string().required('Postal code is required'),
});
