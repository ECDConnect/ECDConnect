import * as Yup from 'yup';

export interface MotherDetailsModel {
  name?: string;
  surname?: string;
  age?: string;
  id?: string;
  relationshipId?: string;
  isMother?: boolean;
}

export const initialMotherDetailsValues: MotherDetailsModel = {
  name: '',
  surname: '',
  age: '',
  id: '',
  relationshipId: '',
  isMother: false,
};

export const motherDetailsModelSchema = Yup.object().shape({
  name: Yup.string().required('First Name is required'),
  surname: Yup.string().required('Surname is required'),
  age: Yup.string(),
  id: Yup.string(),
  relationshipId: Yup.string().required('Relationship is required'),
});
