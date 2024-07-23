import { SA_CELL_REGEX, SA_ID_REGEX, SA_PASSPORT_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface ResetPasswordModel {
  phoneNumber?: string;
}

export const initialResetPasswordValues: ResetPasswordModel = {
  phoneNumber: '',
};

export const resetPasswordSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(SA_CELL_REGEX, 'Please enter a valid cell number'),
});
