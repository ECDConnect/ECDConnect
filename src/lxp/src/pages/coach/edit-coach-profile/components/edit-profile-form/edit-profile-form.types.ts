import { FormComponentProps } from '@ecdlink/core';
import { EditProfileModel } from '@schemas/coach/edit-profile';

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

export interface EditProfileFormProps
  extends FormComponentProps<EditProfileModel> {
  coachProfileInformation?: EditProfileModel;
}
