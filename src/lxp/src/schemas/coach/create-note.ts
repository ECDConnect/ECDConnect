import * as Yup from 'yup';

export interface CreateNoteFormModel {
  title: string;
  body: string;
}

export const defaultCreateNoteFormSchema: CreateNoteFormModel = {
  title: '',
  body: '',
};

export const createNoteFormSchema = Yup.object().shape({
  title: Yup.string().required(),
  body: Yup.string().required(),
});
