import * as Yup from 'yup';

export interface CareGiverChildInformationFormModel {
  streetAddress: string;
  postalCode: string;
}

export const careGiverChildInformationFormSchema = Yup.object().shape({
  streetAddress: Yup.string(),
  postalCode: Yup.string()
    .length(4, 'Please enter a valid postal code.')
    .matches(/^[0-9]{4}/, 'Please enter a valid postal code.')
    .required('Please enter a valid postal code.'),
});
