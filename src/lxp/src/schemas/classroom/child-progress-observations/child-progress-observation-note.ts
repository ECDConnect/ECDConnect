import * as Yup from 'yup';

export interface ChildProgressObservationNoteModel {
  note: string;
}

export const childProgressObservationNoteFormSchema = Yup.object().shape({
  note: Yup.string().required(),
});
