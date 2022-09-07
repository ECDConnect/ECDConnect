import * as Yup from 'yup';

export interface PregnantConsentModel {
  hasConsent: boolean;
  numberOfChildren?: number | undefined;
}

export const initialPregnantDetailsValues: PregnantConsentModel = {
  hasConsent: false,
  numberOfChildren: 0,
};

export const pregnantConsentModelSchema = Yup.object().shape({
  hasConsent: Yup.bool().required('Consent is required'),
  numberOfChildren: Yup.number(),
});
