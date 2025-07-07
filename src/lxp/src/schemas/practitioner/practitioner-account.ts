import { containsNumericRegex, containsUpperCaseRegex } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface PractitionerAccountModel {
  password: string;
}

export const initialPractitionerAccountValues: PractitionerAccountModel = {
  password: '',
};

export const practitionerAccountModelSchema = Yup.object().shape({
  password: Yup.string()
    .required()
    .min(8, 'At least 8 characters')
    .matches(containsNumericRegex, 'At least 1 number')
    .matches(containsUpperCaseRegex, 'At least 1 capital letter'),
});
