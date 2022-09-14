import * as Yup from 'yup';

export interface PregnantDetailsModel {
  name?: string;
  surname?: string;
  age?: string;
}

export const initialMomDetailsValues: PregnantDetailsModel = {
  name: '',
  surname: '',
  age: '',
};

export const pregnantDetailsModelSchema = Yup.object().shape({
  name: Yup.string().required('First Name is required'),
  surname: Yup.string().required('Surname is required'),
  age: Yup.string().required('Age is required'),
});
