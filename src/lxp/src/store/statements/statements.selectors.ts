import {
  BalanceSheetDto,
  ExpensesStatementsDto,
  ExpensesStatementsTypes,
  IncomeStatementsDto,
  IncomeStatementsTypes,
  ReportTableDataDto,
  StatementsContributionTypes,
  StatementsFeeTypes,
  StatementsPayTypes,
} from '@/../../../packages/core/lib';
import { RootState } from '../types';

const PRESCHOOL_FEE_ID = '3915acb0-db44-a323-c086-fe3376d2bfd4';
const STARTUP_SUPPORT_ID = '746586a7-5191-5f64-e561-ef4b04bcdf32';
const DONATION_ID = 'af94450e-c92b-6e8a-88f0-b5ee19e6ff6f';
const DBE_SUBSIDY_ID = 'b58942b9-5199-5cdc-f103-7cbd048586af';
const OTHER_INCOME_ID = '8e8e9114-2c1d-d8e4-caf8-ed5ab9e1e78a';

const RENT_EXPENSE_ID = '64d8bb74-0cd5-43c6-b5f9-bf770ad7e05b';
const FOOD__EXPENSE_ID = '5a879191-f0ff-f3dc-dc1a-326d26a21daf';
const LEARNING_MATERIALS_ID = '21739cd5-de35-3579-c30c-bd2337770c3c';
const MAINTENANCE_ID = '4e2fd7d4-5b8e-b020-a8e0-eb559832ba02';
const OTHER__EXPENSE_ID = '9ca053ea-9fa5-c3f9-d72f-2ac73289820b';
export const UTILITIES__EXPENSE_ID = 'cbd9eb92-70a2-6fd2-caca-f6b137842e24';
const SALARY_EXPENSE_ID = '8c70d480-7579-477e-ec7e-db3515345840';

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

export const getIncome = (
  state: RootState
): IncomeStatementsDto[] | undefined => state?.statements?.income || [];

export const getExpenses = (
  state: RootState
): IncomeStatementsDto[] | undefined => state?.statements?.expenses || [];

export const getBalanceSheet = (
  state: RootState
): BalanceSheetDto[] | undefined =>
  [...(state.statements.balanceSheet || [])].sort(
    (a, b) => a.month - b.month
  ) || [];

// Income types selectors
export const getPreschoolFeeIncome = (state: RootState): IncomeStatementsDto =>
  state.statements?.incomeTypes?.find(
    (item) => item?.id === PRESCHOOL_FEE_ID
  ) || '';

export const getStartupSupportIncome = (
  state: RootState
): IncomeStatementsDto =>
  state.statements?.incomeTypes?.find(
    (item) => item?.id === STARTUP_SUPPORT_ID
  ) || '';

export const getDonationIncome = (state: RootState): IncomeStatementsDto =>
  state.statements?.incomeTypes?.find((item) => item?.id === DONATION_ID) || '';

export const getdbeSubsidyIncome = (state: RootState): IncomeStatementsDto =>
  state.statements?.incomeTypes?.find((item) => item?.id === DBE_SUBSIDY_ID) ||
  '';

export const getOtheryIncome = (state: RootState): IncomeStatementsDto =>
  state.statements?.incomeTypes?.find((item) => item?.id === OTHER_INCOME_ID) ||
  '';

// Expense types selectors
export const getRentExpense = (state: RootState): ExpensesStatementsDto =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === RENT_EXPENSE_ID
  ) || '';

export const getFoodExpense = (state: RootState): ExpensesStatementsDto =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === FOOD__EXPENSE_ID
  ) || '';

export const getLearingMaterialsExpense = (
  state: RootState
): ExpensesStatementsDto =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === LEARNING_MATERIALS_ID
  ) || '';

export const getMaintenanceExpense = (
  state: RootState
): ExpensesStatementsDto =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === MAINTENANCE_ID
  ) || '';

export const getOtherExpense = (state: RootState): ExpensesStatementsDto =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === OTHER__EXPENSE_ID
  ) || '';

export const getUtilitiesExpense = (state: RootState): ExpensesStatementsDto =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === UTILITIES__EXPENSE_ID
  ) || '';

export const getSalaryExpense = (state: RootState): ExpensesStatementsDto =>
  state.statements?.expensesTypes?.find(
    (item) => item?.id === SALARY_EXPENSE_ID
  ) || '';

export const getIncomeExpensesPDFreport = (
  state: RootState
): ReportTableDataDto[] | undefined => state?.statements?.pdfReportData || [];
