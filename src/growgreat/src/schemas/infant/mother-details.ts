import * as Yup from 'yup';

export interface MotherDetailsModel {
  name?: string;
  surname?: string;
  age?: string;
  relationshipId?: string;
}

export const initialMotherDetailsValues: MotherDetailsModel = {
  name: '',
  surname: '',
  age: '',
  relationshipId: '',
};

export const motherDetailsModelSchema = Yup.object().shape({
  name: Yup.string().required('First Name is required'),
  surname: Yup.string().required('Surname is required'),
  age: Yup.string().required('Age is required'),
  relationshipId: Yup.string().required('Relationship is required'),
});
