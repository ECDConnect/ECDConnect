import { PractitionerDto } from '@ecdlink/core';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';

export interface ReassignClassPageState {
  practitionerId: string;
  childId?: string;
  reportingDate?: string | any;
  allAbsenteeClasses?: AbsenteeDto[];
  principalPractitioner?: PractitionerDto;
  isFromEditPractitionersPage?: boolean;
  isFromPrincipalPractitionerProfile?: boolean;
}

export const yesNoOptions = [
  { text: '1 day', value: true },
  { text: 'More than 1 day', value: false },
];
