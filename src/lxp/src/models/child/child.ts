import { CareGiverChildInformationFormModel } from '@schemas/child/child-registration/care-giver-child-information-form';
import { CareGiverContributionFormModel } from '@schemas/child/child-registration/care-giver-contribution-form';
import { CareGiverExtraInformationFormModel } from '@schemas/child/child-registration/care-giver-extra-information';
import { CareGiverInformationFormModel } from '@schemas/child/child-registration/care-giver-information-form';
import { CareGiverReferencePanelFormModel } from '@schemas/child/child-registration/care-giver-reference-panel-form';
import { ChildBirthCertificateFormModel } from '@schemas/child/child-registration/child-birth-certificate-form';
import { ChildEmergencyContactFormModel } from '@schemas/child/child-registration/child-emergency-contact-form';
import { ChildExtraInformationFormModel } from '@schemas/child/child-registration/child-extra-information-form';
import { ChildHealthInformationFormModel } from '@schemas/child/child-registration/child-health-information-form';
import { ChildInformationFormModel } from '@schemas/child/child-registration/child-information-form';
import { ChildRegistrationFormModel } from '@schemas/child/child-registration/child-registration-form';

export type ChildRegistrationFormState = {
  childInformationFormModel?: ChildInformationFormModel;
  childExtraInformationFormModel?: ChildExtraInformationFormModel;
  childHealthInformationFormModel?: ChildHealthInformationFormModel;
  childBirthCertificateFormModel?: ChildBirthCertificateFormModel;
  careGiverInformationFormModel?: CareGiverInformationFormModel;
  careGiverChildInformationFormModel?: CareGiverChildInformationFormModel;
  careGiverExtraInformationFormModel?: CareGiverExtraInformationFormModel;
  careGiverContributionFormModel?: CareGiverContributionFormModel;
  careGiverReferencePanelFormModel?: CareGiverReferencePanelFormModel;
  childRegistrationFormModel?: ChildRegistrationFormModel;
  childEmergencyContactFormModel?: ChildEmergencyContactFormModel;
};

export type CaregiverFormProps = keyof ChildRegistrationFormState;

export type StateAction = {
  formProp: CaregiverFormProps;
  value: any;
};
