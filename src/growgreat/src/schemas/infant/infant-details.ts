import * as Yup from 'yup';

export interface InfantDetailsModel {
  firstName?: string;
  dateOfBirth?: Date;
  genderId?: string;
}

export const initialInfantDetailsValues: InfantDetailsModel = {
  firstName: '',
  dateOfBirth: new Date(0),
  genderId: '',
};

export const infantDetailsModelSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
  genderId: Yup.string().required('Gender is required'),
});
