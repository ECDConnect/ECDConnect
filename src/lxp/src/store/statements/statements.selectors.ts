import {
  ExpenseItemDto,
  ExpensesStatementsTypes,
  IncomeItemDto,
  IncomeStatementDto,
  IncomeStatementsTypes,
  ReportTableDataDto,
  StatementsContributionTypes,
  StatementsFeeTypes,
  StatementsPayTypes,
} from '@/../../../packages/core/lib';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import {
  StatementsExpensesInput,
  StatementsIncomeInput,
} from '@ecdlink/graphql';

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
  (state: RootState) => state.statements.incomeStatements,
  (statements: IncomeStatementDto[]) =>
    [...statements].sort((a, b) => a.year - b.year || a.month - b.month)
);

export const getUnsubmittedIncomeItems = (state: RootState): IncomeItemDto[] =>
  state?.statements?.unSubmittedIncomeItems;

export const getUnsubmittedExpenseItems = (
  state: RootState
): ExpenseItemDto[] => state?.statements?.unSubmittedExpenseItems;

export const getStatementById = (statementId: string) =>
  createSelector(
    (state: RootState) => state.statements.incomeStatements,
    (statements: IncomeStatementDto[]) => {
      return statements.find((x) => x.id === statementId);
    }
  );

export const getUnsyncedIncomeItems = (
  state: RootState
): StatementsIncomeInput[] => state?.statements?.unsyncedIncomeItems;

export const getUnsyncedExpenseItems = (
  state: RootState
): StatementsExpensesInput[] => state?.statements?.unsyncedExpenseItems;
