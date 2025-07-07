import * as Yup from 'yup';

export interface ChildRegistrationFormModel {
  childPhotoConsentAccepted: boolean;
  personalInformationAgreementAccepted: boolean;
}

export const getChildRegistrationFormSchema = () => {
  return Yup.object().shape({
    childPhotoConsentAccepted: Yup.boolean().required(),
    personalInformationAgreementAccepted: Yup.boolean().required().isTrue(),
  });
};
