import { PractitionerDto } from '@ecdlink/core';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';

export const getPractitionerForCoach = (
  state: RootState
): PractitionerDto | undefined =>
  state.practitionerForCoach.practitionerForCoach;

export const getPractitionersForCoach = (
  state: RootState
): PractitionerDto[] | undefined =>
  state.practitionerForCoach.practitionersForCoach;

export const getStatementsForUser = (userId: string) =>
  createSelector(
    (state: RootState) =>
      state.practitionerForCoach.statementsForPractitionerUser,
    (statements) => {
      return [...(statements[userId]?.statements || [])].sort(
        (a, b) => a.year - b.year || a.month - b.month
      );
    }
  );

export const getUnsubmittedIncomeForUser = (userId: string) =>
  createSelector(
    (state: RootState) =>
      state.practitionerForCoach.statementsForPractitionerUser,
    (statements) => {
      return statements[userId]?.unsubmittedIncomeItems || [];
    }
  );

export const getUnsubmittedExpensesForUser = (userId: string) =>
  createSelector(
    (state: RootState) =>
      state.practitionerForCoach.statementsForPractitionerUser,
    (statements) => {
      return statements[userId]?.unsubmittedExpenseItems || [];
    }
  );

export const getUserStatementById = (userId: string, statementId: string) =>
  createSelector(
    (state: RootState) =>
      state.practitionerForCoach.statementsForPractitionerUser,
    (statements) => {
      return statements[userId]?.statements.find((x) => x.id === statementId);
    }
  );
