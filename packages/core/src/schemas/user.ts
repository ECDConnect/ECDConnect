import * as Yup from 'yup';
import { UserDto } from '../models/dto/Users/user.dto';

export const initialUserDetailsValues: UserDto = {
  isSouthAfricanCitizen: false,
  idNumber: '',
  verifiedByHomeAffairs: false,
  dateOfBirth: undefined,
  genderId: undefined,
  firstName: '',
  surname: '',
  contactPreference: 'sms',
  phoneNumber: '',
  email: '',
};

export const userSchema = Yup.object().shape({
  isSouthAfricanCitizen: Yup.bool(),
  idNumber: Yup.string().required('ID Number is Required'),
  verifiedByHomeAffairs: Yup.bool(),
  dateOfBirth: Yup.date().required('Date of birth is Required'),
  genderId: Yup.string().required('Sex is Required'),
  firstName: Yup.string().required('First name is Required'),
  surname: Yup.string().required('Surname is Required'),
  contactPreference: Yup.string().required('Contact Preference is Required'),
  phoneNumber: Yup.string().required('Phone Number is Required'),
  email: Yup.string().email('Invalid email'),
});
