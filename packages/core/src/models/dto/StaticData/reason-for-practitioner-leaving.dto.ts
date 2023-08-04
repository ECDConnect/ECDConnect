import { EntityStaticBase } from '../entity-static-base';

export interface ReasonForPractitionerLeavingDto extends EntityStaticBase {
  description: string;
}

export const ReasonsForPractitionerLeaving = {
  DELICENSED: '4ad4e79f-9446-4584-94d8-484e16c6336c',
  OTHER: '528d108a-b70a-4cbb-943e-f799cecceba6',
};
