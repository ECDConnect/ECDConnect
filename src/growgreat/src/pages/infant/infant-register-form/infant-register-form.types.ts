export enum InfantRegisterSteps {
  consentAgreement = 0,
  infantDetails = 1,
  infantRoadToHealth = 2,
  motherDetails = 3,
  pregnantContactInformation = 4,
  pregnantAddress = 5,
}

export interface MultipleChildrenProps {
  dateOfBirth?: Date;
  genderId?: string;
  firstName?: string;
  roadToHealthBook?: string;
  userId?: string;
  weightAtBirth?: number;
  lengthAtBirth?: number;
  motherId?: '';
  relationshipId?: string;
}
