import { ComponentBaseProps } from '@ecdlink/ui';

export enum CaregiverChildRegistrationSteps {
  welcome = 0,
  registrationForm = 1,
  childInformationForm = 2,
  childExtraInformationForm = 3,
  childHealthInformationForm = 4,
  // childBirthCertificateForm = 50,
  childCareGiverInformationForm = 5,
  childCareGiverChildInformationForm = 6,
  childCareGiverExtraInformationForm = 7,
  // childCareGiverContributionForm = 8,
  childEmergencyContactForm = 8,
  // careGiverReferencePanelForm = 9,
  outro = 9,
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
