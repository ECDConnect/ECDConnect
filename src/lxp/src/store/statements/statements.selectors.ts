import { IncomeStatementsDto } from '@/../../../packages/core/lib';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';

// Statements types
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

export const getExpenses = (
  state: RootState
): IncomeStatementsDto[] | undefined => state?.statements?.expenses || [];

// Income types selectors
export const getPreschoolFeeIncome = (state: RootState): any[] =>
  state.statements?.incomeTypes?.find(
    (item) => item?.id === '3915acb0-db44-a323-c086-fe3376d2bfd4'
  ) || '';

export const getStartupSupportIncome = (state: RootState): any[] =>
  state.statements?.incomeTypes?.find(
    (item) => item?.id === '746586a7-5191-5f64-e561-ef4b04bcdf32'
  ) || '';

export const getDonationIncome = (state: RootState): any[] =>
  state.statements?.incomeTypes?.find(
    (item) => item?.id === 'af94450e-c92b-6e8a-88f0-b5ee19e6ff6f'
  ) || '';

export const getdbeSubsidyIncome = (state: RootState): any[] =>
  state.statements?.incomeTypes?.find(
    (item) => item?.id === 'b58942b9-5199-5cdc-f103-7cbd048586af'
  ) || '';

export const getOtheryIncome = (state: RootState): any[] =>
  state.statements?.incomeTypes?.find(
    (item) => item?.id === '8e8e9114-2c1d-d8e4-caf8-ed5ab9e1e78a'
  ) || '';

// Expense types selectors
export const getRentExpense = (state: RootState): any[] =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === '64d8bb74-0cd5-43c6-b5f9-bf770ad7e05b'
  ) || '';

export const getFoodExpense = (state: RootState): any[] =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === '5a879191-f0ff-f3dc-dc1a-326d26a21daf'
  ) || '';

export const getLearingMaterialsExpense = (state: RootState): any[] =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === '21739cd5-de35-3579-c30c-bd2337770c3c'
  ) || '';

export const getMaintenanceExpense = (state: RootState): any[] =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === '4e2fd7d4-5b8e-b020-a8e0-eb559832ba02'
  ) || '';

export const getOtherExpense = (state: RootState): any[] =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === '9ca053ea-9fa5-c3f9-d72f-2ac73289820b'
  ) || '';

export const getUtilitiesExpense = (state: RootState): any[] =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === 'cbd9eb92-70a2-6fd2-caca-f6b137842e24'
  ) || '';

export const getSalaryExpense = (state: RootState): any[] =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === '8c70d480-7579-477e-ec7e-db3515345840'
  ) || '';
