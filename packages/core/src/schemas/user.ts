import * as Yup from 'yup';
import { UserDto } from '../models/dto/Users/user.dto';
import {
  SIX_DIGITS,
  SA_CELL_REGEX,
  SA_PASSPORT_REGEX,
  SA_ID_REGEX,
} from '@ecdlink/ui';

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
  lockoutEnd: undefined,
};
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const userSchema = Yup.object().shape({
  isSouthAfricanCitizen: Yup.bool(),
  idNumber: Yup.string()
    .matches(SA_ID_REGEX || SA_PASSPORT_REGEX, 'Id number is not valid')
    .required('ID Number is Required'),
  verifiedByHomeAffairs: Yup.bool(),
  // dateOfBirth: Yup.date().required('Date of birth is Required'),
  // genderId: Yup.string().required('Sex is Required'),
  firstName: Yup.string().required('First name is Required'),
  surname: Yup.string().required('Surname is Required'),
  // contactPreference: Yup.string().required('Contact Preference is Required'),
  phoneNumber: Yup.string()
    .matches(SA_CELL_REGEX, 'Phone number is not valid')
    .required('Phone is required'),
  email: Yup.string().email('Invalid email'),
});
