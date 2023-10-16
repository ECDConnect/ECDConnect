import {
  ExpensesStatementsDto,
  IncomeStatementsDto,
  PractitionerDto,
  UserDto,
} from '@ecdlink/core';

export type PrincipalPractitioners = Partial<
  Pick<UserDto, 'firstName' | 'surname' | 'idNumber' | 'id'> & {
    userId: string;
  }
>;
export interface PractitionerState {
  practitioner?: PractitionerDto;
  practitioners?: PractitionerDto[];
  principalPractitioners?: PrincipalPractitioners[];
}
