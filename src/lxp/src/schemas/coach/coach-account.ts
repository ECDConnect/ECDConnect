import { containsNumericRegex, containsUpperCaseRegex } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface CoachAccountModel {
  password: string;
}

export const initialCoachAccountValues: CoachAccountModel = {
  password: '',
};

export const coachAccountModelSchema = Yup.object().shape({
  password: Yup.string()
    .required()
    .min(8, 'At least 8 characters')
    .matches(containsNumericRegex, 'At least 1 number')
    .matches(containsUpperCaseRegex, 'At least 1 capital letter'),
});
