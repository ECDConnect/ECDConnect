import { FormComponentProps } from '@ecdlink/core';
import { PregnantRegisterModel } from '@/schemas/pregnant/pregnant-register-form';

export interface EditConsentAgreementProps
  extends FormComponentProps<PregnantRegisterModel> {
  hasConsent?: boolean;
  numberOfChildren?: number;
  multipleChildren?: boolean;
  setMultipleChildren?: any;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];
