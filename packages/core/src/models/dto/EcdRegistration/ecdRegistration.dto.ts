export type EcdRegistrationDto = {
  id: string;
  userId?: string;
  practitionerId: string;
  subsidy: number;
  registrationType?: string;
  challenges: string;
  challengesOtherReason?: string;
  hasBronzeCertificate: boolean;
  hasSilverCertificate: boolean;
  hasGoldCertificate: boolean;
  problemDescription: string;
  creationReason?: string;
};

export type EcdRegistrationHistoryDto = {
  id: string;
  ecdRegistrationId: string;
  propertyName: string;
  oldValue?: string;
  newValue?: string;
  changeReason?: string;
  changedByUserId: string;
  changedAt: string;
};
