import { IncomeStatementsDto } from '@/../../../packages/core/lib';
import { RootState } from '../types';

export const getExpensesTypes = (state: RootState): any[] =>
  state.statements?.expensesTypes || [];

export const getIncomeTypes = (state: RootState): any[] =>
  state.statements?.incomeTypes || [];
export const getFeeTypes = (state: RootState): any[] =>
  state.statements?.feeTypes || [];
export const getContributionTypes = (state: RootState): any[] =>
  state.statements?.contributionTypes || [];
export const getPayTypes = (state: RootState): any[] =>
  state.statements?.payTypes || [];

export const getIncome = (
  state: RootState
): IncomeStatementsDto[] | undefined => state?.statements?.income || [];
