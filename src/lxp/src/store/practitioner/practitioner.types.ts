import {
  BalanceSheetDto,
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
  balanceSheet?: any[];
  expenses?: ExpensesStatementsDto[];
  income?: IncomeStatementsDto[];
  feeTypes: any[] | undefined;
  expensesTypes: any[] | undefined;
  incomeTypes: any[] | undefined;
  pdfReportData: any[] | undefined;
  contributionTypes: any[] | undefined;
  payTypes: undefined;
}
