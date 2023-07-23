import * as Yup from 'yup';
import { EditProfileRequestModel } from '../models/EditProfile';

export const initialEditProfileValues: EditProfileRequestModel = {
  firstName: '',
  surname: '',
  password: '',
};

export const editProfileSchema = Yup.object().shape({
  name: Yup.string().required(),
  surname: Yup.string().required(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])/,
      'Password must contain at least 1 capital letter and 1 number'
    )
    .required('Password is required'),
});
