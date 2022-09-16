import { SIX_DIGITS } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface VerifyPhoneNumberModel {
  code?: string;
}

export const verifyPhoneNumberSchema = Yup.object().shape({
  code: Yup.string().required().matches(SIX_DIGITS),
});
