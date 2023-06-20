import * as Yup from 'yup';

export interface CareGiverChildInformationFormModel {
  apartmentNumber: string;
  streetAddress: string;
  suburb: string;
  city: string;
  provinceId: string;
  postalCode: string;
}

export const careGiverChildInformationFormSchema = Yup.object().shape({
  streetAddress: Yup.string().required('Street address is required'),
  suburb: Yup.string().required('Suburb is required'),
  city: Yup.string().required('City is required'),
  provinceId: Yup.string().required(),
  postalCode: Yup.string()
    .length(4, 'Please enter a valid postal code.')
    .matches(/^[0-9]{4}/, 'Please enter a valid postal code.')
    .required('Please enter a valid postal code.'),
});
