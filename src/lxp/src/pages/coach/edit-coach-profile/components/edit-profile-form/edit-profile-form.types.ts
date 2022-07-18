import { EditProfileInformationModel } from '@schemas/coach/edit-profile';
import { FormComponentProps } from '@ecdlink/core';

export interface EditProfileFormProps
  extends FormComponentProps<EditProfileInformationModel> {
  coachProfileInformation?: EditProfileInformationModel;
}
