import { PractitionerDto } from '@ecdlink/core';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';

export interface ReassignClassPageState {
  practitionerId: number;
  childId: string;
  reportingDate?: string | any;
  allAbsenteeClasses?: AbsenteeDto[];
  principalPractitioner?: PractitionerDto;
}

export const yesNoOptions = [
  { text: '1 day', value: true },
  { text: 'More than 1 day', value: false },
];
