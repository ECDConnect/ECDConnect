import * as Yup from 'yup';

export const setupOrgValues = {
  orgName: '',
  catchyName: '',
  orgEmail: '',
  appUrl: '',
  darkVersionLogo: '',
  lightVersionLogo: '',
  favico: '',
};

export interface SetupOrgModel {
  orgName: string;
  catchyName: string;
  orgEmail: string;
  appUrl: string;
  darkVersionLogo: string;
  lightVersionLogo: string;
  favico: string;
}

export const setuOrgSchema = Yup.object().shape({
  orgName: Yup.string().required('Name is required'),
  catchyName: Yup.string(),
  orgEmail: Yup.string().email('Invalid email').required('Email is required'),
  appUrl: Yup.string().required('URL is required'),
  darkVersionLogo: Yup.string(),
  lightVersionLogo: Yup.string(),
  favico: Yup.string(),
});
