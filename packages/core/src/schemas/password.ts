import * as Yup from 'yup';

export interface PasswordModel {
  password: string;
}

export const initialPasswordValue: PasswordModel = {
  password: '',
};

const containsLowerCaseRegex = new RegExp('^(?=.*[a-z]).+$');
const containsUpperCaseRegex = new RegExp('^(?=.*[A-Z]).+$');
const containsNumericRegex = new RegExp('^(?=.*\\d).+$');
const containsSpecialCharactersRegex = new RegExp(
  '^(?=.*[-+_!@#$%^&*., ?]).+$'
);

export const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(
      containsNumericRegex,
      'Password is missing a number - include at least one number.'
    )
    .matches(
      containsUpperCaseRegex,
      'Password is missing a uppercase - include at least one uppercase.'
    ),
});
