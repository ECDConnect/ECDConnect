import * as Yup from 'yup';
import darkLogo from '../../assets/Logo-ECDConnect.svg';
import lightLogo from '../../assets/Logo-ECDConnect-white.svg';
import favicon from '../../assets/favicon.ico';

export const setupOrgValues = {
  orgName: '',
  catchyName: '',
  orgEmail: '',
  appUrl: '',
  darkVersionLogo: darkLogo,
  lightVersionLogo: lightLogo,
  favico: favicon,
  primaryColor: '#27385A',
  secondaryColor: '#FF2180',
  tertiaryColor: '#83BB26',
  tokenId: '',
  tokenSecret: '',
  tokenBasicAuth: '',
  tokenUserName: '',
  tokenPassword: '',
  apiKey: '',
  apiSecret: '',
  attendanceEnabled: false,
  businessEnabled: false,
  calendarEnabled: false,
  classroomActivitiesEnabled: false,
  coachRoleEnabled: false,
  coachRoleName: '',
  prgoressEnabled: false,
  trainingEnabled: false,
  superAdmin1FirstName: '',
  superAdmin1Surname: '',
  superAdmin1Email: '',
  superAdmin2FirstName: '',
  superAdmin2Surname: '',
  superAdmin2Email: '',
};

export interface SetupOrgModel {
  orgName: string;
  catchyName: string;
  orgEmail: string;
  appUrl: string;
  darkVersionLogo: string;
  lightVersionLogo: string;
  favico: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  tokenId: string;
  tokenSecret: string;
  tokenBasicAuth: string;
  tokenUserName: string;
  tokenPassword: string;
  apiKey: string;
  apiSecret: string;
  attendanceEnabled: boolean;
  businessEnabled: boolean;
  calendarEnabled: boolean;
  classroomActivitiesEnabled: boolean;
  coachRoleEnabled: boolean;
  coachRoleName: string;
  prgoressEnabled: boolean;
  trainingEnabled: boolean;
  superAdmin1FirstName: string;
  superAdmin1Surname: string;
  superAdmin1Email: string;
  superAdmin2FirstName: string;
  superAdmin2Surname: string;
  superAdmin2Email: string;
}

export const setuOrgSchema = Yup.object().shape({
  orgName: Yup.string().required('Name is required'),
  catchyName: Yup.string(),
  orgEmail: Yup.string().email('Invalid email').required('Email is required'),
  appUrl: Yup.string().required('URL is required'),
  darkVersionLogo: Yup.string(),
  lightVersionLogo: Yup.string(),
  favico: Yup.string(),
  superAdmin1FirstName: Yup.string().required('First name is required!'),
  superAdmin1Surname: Yup.string().required('Surname is required!'),
  superAdmin1Email: Yup.string()
    .required('Email is Required')
    .email('Invalid email'),
  superAdmin2FirstName: Yup.string().required('First name is required!'),
  superAdmin2Surname: Yup.string().required('Surname is required!'),
  superAdmin2Email: Yup.string()
    .required('Email is Required')
    .email('Invalid email'),
});
