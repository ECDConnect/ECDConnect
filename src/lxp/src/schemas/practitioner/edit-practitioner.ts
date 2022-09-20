import * as Yup from 'yup';

export interface EditPractitionerModel {
  id?: string;
  userId?: string;
  firstName: string;
  surname: string;
}

export const initialEditPractitionerValues: EditPractitionerModel = {
  firstName: '',
  surname: '',
};

export const editPractitionerSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  surname: Yup.string().required(),
});
