import * as Yup from 'yup';

export interface PregnantDetailsModel {
  name?: string;
  surname?: string;
  age?: string;
  id?: string;
}

export const initialMomDetailsValues: PregnantDetailsModel = {
  name: '',
  surname: '',
  age: '',
  id: '',
};

export const pregnantDetailsModelSchema = Yup.object().shape({
  name: Yup.string().required('First Name is required'),
  surname: Yup.string().required('Surname is required'),
  age: Yup.string(),
  id: Yup.string(),
});
