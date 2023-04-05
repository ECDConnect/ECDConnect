import { FormComponentProps } from '@ecdlink/core';
import { ChildBirthCertificateFormModel } from '@schemas/child/child-registration/child-birth-certificate-form';

export interface ChildChildBirthCertificateFormProps
  extends FormComponentProps<ChildBirthCertificateFormModel> {
  childBirthCertificateForm?: ChildBirthCertificateFormModel;
}
