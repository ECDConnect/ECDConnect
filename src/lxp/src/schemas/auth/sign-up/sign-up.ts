import {
  containsNumericRegex,
  containsUpperCaseRegex,
  SA_CELL_REGEX,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
} from '@ecdlink/ui';
import * as Yup from 'yup';

export interface SignUpModel {
  preferId: boolean;
  username: string;
  cellphone: string;
  password: string;
  termsAndConditionsAccepted: boolean;
  dataPermissionAgreementAccepted: boolean;
}

export const initialRegisterValues: SignUpModel = {
  preferId: true,
  username: '',
  cellphone: '',
  password: '',
  termsAndConditionsAccepted: false,
  dataPermissionAgreementAccepted: false,
};

export const signUpSchema = Yup.object().shape({
  username: Yup.string().when('preferId', {
    is: true,
    then: Yup.string()
      .matches(SA_ID_REGEX, 'Please enter a valid ID number')
      .required(),
    otherwise: Yup.string()
      .matches(SA_PASSPORT_REGEX, 'Please enter a valid passport number')
      .required(),
  }),
  cellphone: Yup.string()
    .required('Cellphone number is required')
    .matches(SA_CELL_REGEX, 'Please enter a valid cellphone number'),
  termsAndConditionsAccepted: Yup.boolean()
    .required()
    .isTrue('Please accept the terms and conditions'),
  dataPermissionAgreementAccepted: Yup.boolean()
    .required()
    .isTrue('Please accept the data agreement'),
});
