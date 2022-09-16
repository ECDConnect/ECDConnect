import * as Yup from 'yup';

export interface InfantRegisterModel {
  firstName?: string;
  dateOfBirth?: Date;
  caregiver?: Object;
  caregiverId?: string;
  motherId?: string;
  genderId?: string;
  weightAtBirth?: number;
  lengthAtBirth?: number;
  address?: string;
}

export const initialInfantFormValues: InfantRegisterModel = {
  firstName: '',
  dateOfBirth: new Date('01/01/2021 23:00'),
  caregiver: {},
  caregiverId: '',
  motherId: '',
  genderId: '',
  weightAtBirth: 0,
  lengthAtBirth: 0,
  address: '',
};

export const infantAboutModelSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  dateOfBirth: Yup.date(),
  caregiver: Yup.object().required('Caregiver is required'),
  motherId: Yup.string().required('Caregiver id is required'),
  genderId: Yup.string().required('GenderId is required'),
  weightAtBirth: Yup.number().required('weight required'),
  lengthAtBirth: Yup.number().required('Lenght required'),
  address: Yup.string().required('Address is required'),
});
