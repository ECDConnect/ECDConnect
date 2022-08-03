import { PractitionerDto } from '@ecdlink/core';

export interface PractitionerState {
  practitioner?: PractitionerDto;
  practitioners?: PractitionerDto[];
  principalPractitioners?: PractitionerDto[];
}
