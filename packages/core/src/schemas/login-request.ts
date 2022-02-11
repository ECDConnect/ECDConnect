import * as Yup from 'yup';
import { LoginRequestModel } from '../models/login';

export const initialLoginValues: LoginRequestModel = {
  username: '', 
  password: ''
};

export const loginSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),  
});
