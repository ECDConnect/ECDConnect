import * as Yup from 'yup';

export interface PregnantConsentModel {
  hasConsent: boolean;
  numberOfChildren?: number;
}

export const initialPregnantDetailsValues: PregnantConsentModel = {
  hasConsent: false,
  numberOfChildren: 0,
};

export const pregnantConsentModelSchema = Yup.object().shape({
  hasConsent: Yup.bool().required('Consent is required'),
  numberOfChildren: Yup.number()
    .typeError('Please enter a valid number')
    .min(0, 'Please enter a valid number')
    .max(10, 'Please enter a number less than or equal to 10')
    .test(
      'noEOrSign', // type of the validator (should be unique)
      'Please enter a valid number', // error message
      (value) => typeof value === 'number' && !/[eE+-]/.test(value.toString())
    ),
});
