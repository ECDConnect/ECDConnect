import { containsNumericRegex, containsUpperCaseRegex } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface NewPasswordModel {
  password: string;
}

export const initialNewPasswordValues: NewPasswordModel = {
  password: '',
};

export const newPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required()
    .min(8, 'At least 8 characters')
    .matches(containsNumericRegex, 'At least 1 number')
    .matches(containsUpperCaseRegex, 'At least 1 capital letter'),
});
