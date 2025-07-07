import * as Yup from 'yup';
import darkLogo from '../../assets/Logo-ECDConnect.svg';
import lightLogo from '../../assets/Logo-ECDConnect-white.svg';
import favicon from '../../assets/favicon.ico';

export const setupOrgValues = {
  organisationName: '',
  applicationName: 'ECD Connect',
  organisationEmail: '',
  applicationUrl: '',
  darkVersionLogo: darkLogo,
  lightVersionLogo: lightLogo,
  favicon: favicon,
  primaryColor: '#27385A',
  primaryAccent1: '',
  primaryAccent2: '',
  secondaryColor: '#FF2180',
  secondaryAccent1: '',
  secondaryAccent2: '',
  tertiaryColor: '#83BB26',
  tertiaryAccent1: '',
  tertiaryAccent2: '',
  textDark: '#1F192E',
  textMid: '#483E63',
  textLight: '#9B96A6',
  uiMidDark: '#5e557a',
  uiMid: '#827c93',
  uiLight: '#cac5d8',
  uiBg: '#EFF6FA',
  modalBg: '#cac5d8',
  errorMain: '#ED1414',
  errorDark: '#D20000',
  errorBg: '#FFEEF6',
  alertMain: '#FF5C00',
  alertDark: '#E43802',
  alertBg: '#FFEEE4',
  successMain: '#83BB26',
  successDark: '#5A8F02',
  successBg: '#E6F1D4',
  infoMain: '#1D67D5',
  infoDark: '#1752AB',
  infoBb: '#EBF3FF',
  smsProvider: '',
  tokenId: '',
  tokenSecret: '',
  tokenBasicAuth: '',
  tokenUserName: '',
  tokenPassword: '',
  apiKey: '',
  apiSecret: '',
  attendanceEnabled: true,
  businessEnabled: true,
  calendarEnabled: true,
  classroomActivitiesEnabled: true,
  coachRoleEnabled: true,
  coachRoleName: '',
  progressEnabled: true,
  trainingEnabled: true,
  superAdmin1FirstName: '',
  superAdmin1Surname: '',
  superAdmin1Email: '',
  superAdmin2FirstName: '',
  superAdmin2Surname: '',
  superAdmin2Email: '',
};

export interface SetupOrgModel {
  organisationName: string;
  applicationName: string;
  organisationEmail: string;
  applicationUrl: string;
  darkVersionLogo: string;
  lightVersionLogo: string;
  favicon: string;
  primaryColor: string;
  primaryAccent1: string;
  primaryAccent2: string;
  secondaryColor: string;
  secondaryAccent1: string;
  secondaryAccent2: string;
  tertiaryColor: string;
  tertiaryAccent1: string;
  tertiaryAccent2: string;
  textDark: string;
  textMid: string;
  textLight: string;
  uiMidDark: string;
  uiMid: string;
  uiLight: string;
  uiBg: string;
  modalBg: string;
  errorMain: string;
  errorDark: string;
  errorBg: string;
  alertMain: string;
  alertDark: string;
  alertBg: string;
  successMain: string;
  successDark: string;
  successBg: string;
  infoMain: string;
  infoDark: string;
  infoBb: string;
  smsProvider: string;
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
  progressEnabled: boolean;
  trainingEnabled: boolean;
  superAdmin1FirstName: string;
  superAdmin1Surname: string;
  superAdmin1Email: string;
  superAdmin2FirstName: string;
  superAdmin2Surname: string;
  superAdmin2Email: string;
}

export const setuOrgSchema = Yup.object().shape({
  organisationName: Yup.string().required('Name is required'),
  applicationName: Yup.string(),
  organisationEmail: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  applicationUrl: Yup.string().required('URL is required'),
  darkVersionLogo: Yup.string(),
  lightVersionLogo: Yup.string(),
  favicon: Yup.string(),
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
