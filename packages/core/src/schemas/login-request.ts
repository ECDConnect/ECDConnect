import * as Yup from 'yup';
import { LoginRequestModel } from '../models/login';
import { RegisterRequestModel } from '../models/login';
import { PasswordResetModel, SimpleUserModel } from '../models/forgot-password';

export const initialRegisterValues: RegisterRequestModel = {
  username: '',
  password: '',
  token: '',
  acceptedTerms: false,
};
export const initialLoginValues: LoginRequestModel = {
  email: '',
  password: '',
};

export const initialForgotPasswordValues: SimpleUserModel = {
  email: '',
};

export const initialResetPasswordValues: PasswordResetModel = {
  username: '',
  password: '',
  resetToken: '',
};
export const registerSchema = Yup.object().shape({
  username: Yup.string().email().required(),
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
  email: Yup.string().email().required('Email is required'),
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
