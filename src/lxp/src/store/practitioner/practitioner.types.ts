import { PractitionerDto, PrincipalDto, UserDto } from '@ecdlink/core';

export type PrincipalPractitioners = Partial<
  Pick<UserDto, 'firstName' | 'surname' | 'idNumber' | 'id'> & {
    userId: string;
  }
>;
export interface PractitionerState {
  practitioner?: PractitionerDto | undefined;
  practitioners?: PractitionerDto[] | undefined;
  principalPractitioners?: PrincipalPractitioners[];
}
