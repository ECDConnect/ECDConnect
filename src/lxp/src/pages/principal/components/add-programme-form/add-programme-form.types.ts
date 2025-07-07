import { FormComponentProps } from '@ecdlink/core';
import { EditProgrammeModel } from '@schemas/practitioner/edit-programme';

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export interface EditProgrammeFormProps
  extends FormComponentProps<EditProgrammeModel> {
  programme?: EditProgrammeModel;
  setIsNotPrincipal?: any;
}
