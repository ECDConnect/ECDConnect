import { PractitionerDto, UserDto } from '@ecdlink/core';

export type PrincipalPractitioners = Partial<
  Pick<UserDto, 'firstName' | 'surname' | 'idNumber' | 'id'>
>;
export interface PractitionerState {
  practitioner?: PractitionerDto | undefined;
  practitioners?: PractitionerDto[] | undefined;
  principalPractitioners?: PrincipalPractitioners[];
}
