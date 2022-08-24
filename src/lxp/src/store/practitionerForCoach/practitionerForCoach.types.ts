import { PractitionerDto } from '@ecdlink/core';

export interface PractitionerForCoachState {
  practitionerForCoach?: PractitionerDto | undefined;
  practitionersForCoach?: PractitionerDto[] | undefined;
}
