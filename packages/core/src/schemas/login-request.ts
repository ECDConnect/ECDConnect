import * as Yup from 'yup';
import { LoginRequestModel, ResetPasswordRequestModel } from '../models/login';
import { RegisterRequestModel } from '../models/login';

export const initialRegisterValues: RegisterRequestModel = {
  email: '',
  password: '',
  acceptedTerms: false,
};
export const initialLoginValues: LoginRequestModel = {
  email: '',
  password: '',
};

export const initialResetPasswordValues: ResetPasswordRequestModel = {
  email: '',
};

export const initialResetValues: ResetPasswordRequestModel = {
  password: '',
};
export const registerSchema = Yup.object().shape({
  email: Yup.string().required(),
  // email: Yup.string().email().required(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])/,
      'Password must contain at least 1 capital letter and 1 number'
    )
    .required('Password is required'),
  acceptedTerms: Yup.bool().required(),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])/,
      'Password must contain at least 1 capital letter and 1 number'
    )
    .required('Password is required'),
});

export const resetSchema = Yup.object().shape({
  email: Yup.string().email().required(),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])/,
      'Password must contain at least 1 capital letter and 1 number'
    )
    .required('Password is required'),
});
