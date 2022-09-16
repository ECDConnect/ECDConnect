import * as Yup from 'yup';

export interface ChildRegistrationFormModel {
  registrationForm: string;
  childPhotoConsentAccepted: boolean;
  personalInformationAgreementAccepted: boolean;
  consentAgreementAccepted: boolean;
  commitmentAgreementAccepted: boolean;
  indemnityAgreementAccepted: boolean;
}

export const getChildRegistrationFormSchema = (
  variant: 'caregiver' | 'practitioner'
) => {
  return Yup.object().shape({
    registrationForm:
      variant === 'caregiver' ? Yup.string() : Yup.string().required(),
    childPhotoConsentAccepted: Yup.boolean().required(),
    personalInformationAgreementAccepted: Yup.boolean().required().isTrue(),
    consentAgreementAccepted: Yup.boolean().required().isTrue(),
    commitmentAgreementAccepted: Yup.boolean().required().isTrue(),
    indemnityAgreementAccepted: Yup.boolean().required().isTrue(),
  });
};
