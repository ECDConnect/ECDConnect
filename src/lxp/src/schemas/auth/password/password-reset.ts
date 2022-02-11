import { SA_ID_REGEX, SA_PASSPORT_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface ResetPasswordModel {
  preferId: boolean;
  username: string;
}

export const initialResetPasswordValues: ResetPasswordModel = {
  preferId: true,
  username: '',
};

export const resetPasswordSchema = Yup.object().shape({
  username: Yup.string().when('preferId', {
    is: true,
    then: Yup.string().matches(SA_ID_REGEX, 'Please enter a valid ID number').required(),
    otherwise: Yup.string()
      .matches(SA_PASSPORT_REGEX, 'Please enter a valid passport number')
      .required(),
  }),
});
