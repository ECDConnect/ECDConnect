import {
  ExpensesStatementsTypes,
  IncomeStatementDto,
  IncomeStatementsTypes,
  StatementsPayTypes,
} from '@/../../../packages/core/lib';
import { IncomeTypeIds } from '@ecdlink/core';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import { OfflineUpdate } from '@/models/sync/offline-update';
import { OfflineCache } from '@/models/sync/offline-cache';

// Statements types
export const getExpensesTypes = (state: RootState): ExpensesStatementsTypes[] =>
  state.statements.expensesTypes || [];

export const getIncomeTypes = (state: RootState): IncomeStatementsTypes[] =>
  state.statements.incomeTypes || [];

export const getPayTypes = (state: RootState): StatementsPayTypes[] =>
  state.statements.payTypes || [];

export const getBalanceMessageDismissed = (state: RootState): boolean =>
  state.statements.balanceMessageDismissed;

export const getDownloadsMessageDismissed = (state: RootState): boolean =>
  state.statements.downloadsMessageDismissed;

export const getIncomeStatements = createSelector(
  (state: RootState) => state.statements.incomeStatements,
  (statementsData: IncomeStatementDto[]) =>
    [...statementsData].sort((a, b) => a.year - b.year || a.month - b.month)
);

export const getStatementById = (statementId: string) =>
  createSelector(
    (state: RootState) => state.statements.incomeStatements,
    (statements: IncomeStatementDto[]) => {
      return statements.find((x) => x.id === statementId);
    }
  );

export const getStatementForMonth = (year: number, month: number) =>
  createSelector(
    (state: RootState) => state.statements.incomeStatements,
    (statements: IncomeStatementDto[]) =>
      statements.find(
        (statement) => statement.year === year && statement.month === month
      )
  );

export const getPreschoolFeesForMonth = (year: number, month: number) =>
  createSelector(
    getStatementForMonth(year, month),
    (statement: IncomeStatementDto | undefined) => {
      return {
        statementId: statement?.id,
        downloaded: statement?.downloaded,
        fees: !!statement
          ? statement.incomeItems.filter(
              (item) => item.incomeTypeId === IncomeTypeIds.PRESCHOOL_FEE_ID
            )
          : [],
      };
    }
  );

export const getPreschoolFeesForChild = (childUserId: string) =>
  createSelector(
    (state: RootState) => state.statements.incomeStatements,
    (statements: IncomeStatementDto[]) =>
      statements
        .map((statement) => ({
          ...statement,
          incomeItems: statement.incomeItems.filter(
            (x) =>
              x.childUserId === childUserId &&
              x.incomeTypeId === IncomeTypeIds.PRESCHOOL_FEE_ID
          ),
        }))
        .filter((statement) => statement.incomeItems.length > 0)
  );

export const getTotalPreschoolFeesForChild = (childUserId: string) =>
  createSelector(
    (state: RootState) => state.statements.incomeStatements,
    (statements) =>
      statements
        .flatMap((s) => s.incomeItems)
        .filter(
          (item) =>
            item.childUserId === childUserId &&
            item.incomeTypeId === IncomeTypeIds.PRESCHOOL_FEE_ID
        )
        .reduce((sum, item) => sum + item.amount, 0)
  );
