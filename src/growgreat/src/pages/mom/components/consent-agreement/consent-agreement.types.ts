import { FormComponentProps } from '@ecdlink/core';
import { PregnantRegisterModel } from '@/schemas/pregnant/pregnant-register-form';

export interface EditConsentAgreementProps
  extends FormComponentProps<PregnantRegisterModel> {
  hasConsent?: boolean;
}
