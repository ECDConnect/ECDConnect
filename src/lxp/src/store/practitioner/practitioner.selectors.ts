import {
  BalanceSheetDto,
  ExpensesStatementsDto,
  IncomeStatementsDto,
  PractitionerDto,
} from '@ecdlink/core';
import { RootState } from '../types';
import { PrincipalPractitioners } from './practitioner.types';
import { createSelector } from '@reduxjs/toolkit';

export const getPractitioner = (
  state: RootState
): PractitionerDto | undefined => state.practitioner.practitioner;

export const getPractitioners = (
  state: RootState
): PractitionerDto[] | undefined => state.practitioner.practitioners;

export const getPrincipalPractitioners = (
  state: RootState
): PrincipalPractitioners[] | undefined =>
  state.practitioner.principalPractitioners;

export const getPractitionerByUserId = (id: string) =>
  createSelector(
    (state: RootState) => state.practitioner.practitioners,
    (practitioners: PractitionerDto[] | undefined) => {
      if (!practitioners) return;

      return practitioners.find((practitioner) => practitioner.userId === id);
    }
  );

export const getPractitionersByUserIds = (ids: string[]) =>
  createSelector(
    (state: RootState) => state.practitioner.practitioners,
    (practitioners: PractitionerDto[] | undefined) => {
      if (!practitioners || ids.length === 0) return [];

      return practitioners.filter(
        (practitioner) =>
          !!practitioner.userId && ids.includes(practitioner.userId)
      );
    }
  );

export const getPractitionerBalanceSheet = (
  state: RootState
): BalanceSheetDto[] | undefined =>
  [...(state.practitioner.balanceSheet || [])].sort(
    (a, b) => a.month - b.month
  ) || [];

export const getPractitionerIncome = (
  state: RootState
): IncomeStatementsDto[] | undefined => state?.practitioner?.income || [];

export const getPractitionerExpenses = (
  state: RootState
): ExpensesStatementsDto[] | undefined => state?.practitioner?.expenses || [];
