import { PractitionerDto } from '@ecdlink/core';

export interface PractitionerState {
  practitioner?: PractitionerDto | undefined;
  practitioners?: PractitionerDto[] | undefined;
  practitionersForCoach?: PractitionerDto[] | undefined;
}
