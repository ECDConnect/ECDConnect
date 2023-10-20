import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';

export interface ReassignClassPageState {
  practitionerId: number;
  childId: string;
  reportingDate?: string | any;
  allAbsenteeClasses?: AbsenteeDto[];
}

export const yesNoOptions = [
  { text: '1 day', value: true },
  { text: 'More than 1 day', value: false },
];
