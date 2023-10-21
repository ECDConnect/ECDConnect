import { ComponentBaseProps } from '@ecdlink/ui';

export enum CaregiverChildRegistrationSteps {
  welcome = 0,
  registrationForm = 1,
  childInformationForm = 2,
  childExtraInformationForm = 3,
  childHealthInformationForm = 4,
  childBirthCertificateForm = 5,
  childCareGiverInformationForm = 6,
  childCareGiverChildInformationForm = 7,
  childCareGiverExtraInformationForm = 8,
  childCareGiverContributionForm = 9,
  childEmergencyContactForm = 10,
  careGiverReferencePanelForm = 11,
  outro = 12,
}
export interface CaregiverChildRegistrationProps extends ComponentBaseProps {
  childDetails: ChildRegistrationDetails;
  caregiverAuthToken: string;
}

export interface ChildRegistrationDetails {
  child: ChildDetails;
  practitoner: PractitionerDetails;
  accessToken: string;
}

export interface ChildDetails {
  firstname: string;
  surname: string;
  groupName: string;
  userId?: string;
}

export interface PractitionerDetails {
  firstname: string;
  surname: string;
  phoneNumber: string;
}
