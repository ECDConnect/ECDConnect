import {
  ExpensesStatementsTypes,
  IncomeStatementDto,
  IncomeStatementsTypes,
  StatementsContributionTypes,
  StatementsFeeTypes,
  StatementsPayTypes,
} from '@/../../../packages/core/lib';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';

// Statements types
export const getExpensesTypes = (state: RootState): ExpensesStatementsTypes[] =>
  state.statements?.expensesTypes || [];

export const getIncomeTypes = (state: RootState): IncomeStatementsTypes[] =>
  state.statements?.incomeTypes || [];

export const getFeeTypes = (state: RootState): StatementsFeeTypes[] =>
  state.statements?.feeTypes || [];

export const getContributionTypes = (
  state: RootState
): StatementsContributionTypes[] => state.statements?.contributionTypes || [];

export const getPayTypes = (state: RootState): StatementsPayTypes[] =>
  state.statements?.payTypes || [];

export const getIncomeStatements = createSelector(
  (state: RootState) => state.statements.incomeStatementsData.incomeStatements,
  (statementsData: IncomeStatementDto[]) =>
    [...statementsData].sort((a, b) => a.year - b.year || a.month - b.month)
);

export const getStatementById = (statementId: string) =>
  createSelector(
    (state: RootState) =>
      state.statements.incomeStatementsData.incomeStatements,
    (statements: IncomeStatementDto[]) => {
      return statements.find((x) => x.id === statementId);
    }
  );
