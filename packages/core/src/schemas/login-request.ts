import * as Yup from 'yup';
import { LoginRequestModel } from '../models/login';
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

export const registerSchema = Yup.object().shape({
  email: Yup.string().required(),
  // email: Yup.string().email().required(),
  password: Yup.string().min(8).max(32).required(),
  acceptedTerms: Yup.bool().required()
});

export const loginSchema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});
