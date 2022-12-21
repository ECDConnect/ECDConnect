import * as Yup from 'yup';

export interface InfantConsentModel {
  hasConsent: boolean;
  numberOfChildren?: number;
}

export const initialInfantDetailsValues: InfantConsentModel = {
  hasConsent: false,
  numberOfChildren: 0,
};

export const infantConsentModelSchema = Yup.object().shape({
  hasConsent: Yup.bool().required('Consent is required'),
  numberOfChildren: Yup.bool(),
});
