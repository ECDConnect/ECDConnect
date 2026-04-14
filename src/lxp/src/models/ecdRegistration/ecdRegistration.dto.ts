import {
  NonSubsidyRegistrationType,
  ChallengeType,
  SubsidyStatus,
} from '@ecdlink/graphql';

export type EcdRegistrationDto = {
  userId?: string;
  practitionerId: string;
  subsidy: SubsidyStatus;
  registrationType?: NonSubsidyRegistrationType;
  challenges: ChallengeType;
  challengesOtherReason?: string;
  hasBronzeCertificate: boolean;
  hasSilverCertificate: boolean;
  hasGoldCertificate: boolean;
  problemDescription: string;
  creationReason?: string;
};
