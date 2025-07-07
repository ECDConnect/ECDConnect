import { EntityStaticBase } from '../entity-static-base';

export interface ReasonForPractitionerLeavingProgrammeDto
  extends EntityStaticBase {
  description: string;
}

export const ReasonsForPractitionerLeavingProgramme = {
  OTHER: '7049458d-cd48-4e74-883d-9b984e65feee',
};
