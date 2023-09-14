import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import ExpensesStatementsService from '@/services/ExpensesStatementsService/ExpensesStatementsService';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import {
  BalanceSheetDto,
  ExpensesStatementsDto,
  ExpensesStatementsTypes,
  IncomeStatementsDto,
  IncomeStatementsTypes,
  IncomeStatementPDFDocInput,
  ReportTableDataDto,
  StatementsContributionTypes,
} from '@/../../../packages/core/lib';

export const getAllExpenses = createAsyncThunk<
  any[],
  { month: Number; year: Number },
  ThunkApiType<RootState>
>(
  'getAllExpenses',
  // eslint-disable-next-line no-empty-pattern
  async ({ month, year }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let expenses: ExpensesStatementsDto[] | undefined;

      if (userAuth?.auth_token) {
        expenses = await new ExpensesStatementsService(
          userAuth?.auth_token
        ).allStatementsExpenses(userAuth?.id, month, year);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!expenses) {
        return rejectWithValue('Error getting expenses');
      }

      return expenses;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllExpensesTypes = createAsyncThunk<
  any[],
  {},
  ThunkApiType<RootState>
>(
  'getAllExpensesTypes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      statements: { expensesTypes: expensesTypesCached },
    } = getState();

    if (!expensesTypesCached) {
      try {
        let expensesTypes: ExpensesStatementsTypes[] | undefined;

        if (userAuth?.auth_token) {
          expensesTypes = await new ExpensesStatementsService(
            userAuth?.auth_token
          ).GetAllStatementsExpensesType();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!expensesTypes) {
          return rejectWithValue('Error expenses types');
        }
        return expensesTypes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return expensesTypesCached;
    }
  }
);

export const getAllIncome = createAsyncThunk<
  any[],
  { month: Number; year: Number },
  ThunkApiType<RootState>
>(
  'getAllIncome',
  // eslint-disable-next-line no-empty-pattern
  async ({ month, year }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let income: IncomeStatementsDto[] | undefined;

      if (userAuth?.auth_token) {
        income = await new IncomeStatementsService(
          userAuth?.auth_token
        ).allStatementsIncome(userAuth?.id, month, year);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!income) {
        return rejectWithValue('Error getting income');
      }

      return income;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllStatementsBalanceSheet = createAsyncThunk<
  BalanceSheetDto[],
  { year: Number; month: Number | undefined },
  ThunkApiType<RootState>
>(
  'getAllStatementsBalanceSheet',
  // eslint-disable-next-line no-empty-pattern
  async ({ year, month }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let statementsBalanceSheet: BalanceSheetDto[] | undefined;

      if (userAuth?.auth_token) {
        statementsBalanceSheet = await new IncomeStatementsService(
          userAuth?.auth_token
        ).getAllStatementsBalanceSheet(userAuth?.id, year, month);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!statementsBalanceSheet) {
        return rejectWithValue('Error getting income balance sheets');
      }

      return statementsBalanceSheet;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllIncomeTypes = createAsyncThunk<
  IncomeStatementsTypes[],
  {},
  ThunkApiType<RootState>
>(
  'getAllIncomeTypes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      statements: { incomeTypes: incomeTypesCache },
    } = getState();

    if (!incomeTypesCache) {
      try {
        let incomeTypes: IncomeStatementsTypes[] | undefined;

        if (userAuth?.auth_token) {
          incomeTypes = await new IncomeStatementsService(
            userAuth?.auth_token
          ).GetAllStatementsIncomeType();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!incomeTypes) {
          return rejectWithValue('Error getting income types');
        }

        return incomeTypes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return incomeTypesCache;
    }
  }
);

export const getAllStatementsFeeType = createAsyncThunk<
  any[],
  {},
  ThunkApiType<RootState>
>(
  'getAllStatementsFeeType',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      statements: { feeTypes: feeTypesCached },
    } = getState();

    if (!feeTypesCached) {
      try {
        let feeTypes: any[] | undefined;

        if (userAuth?.auth_token) {
          feeTypes = await new IncomeStatementsService(
            userAuth?.auth_token
          ).GetAllStatementsFeeType();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!feeTypes) {
          return rejectWithValue('Erro getting fee types');
        }

        return feeTypes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return feeTypesCached;
    }
  }
);

export const getAllStatementsContributionType = createAsyncThunk<
  any[],
  {},
  ThunkApiType<RootState>
>(
  'getAllStatementsContributionType',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      statements: { contributionTypes: contributionTypesCached },
    } = getState();

    if (!contributionTypesCached) {
      try {
        let contributionTypes: StatementsContributionTypes[] | undefined;

        if (userAuth?.auth_token) {
          contributionTypes = await new IncomeStatementsService(
            userAuth?.auth_token
          ).GetAllStatementsContributionType();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!contributionTypes) {
          return rejectWithValue('Erro getting contribution types');
        }

        return contributionTypes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return contributionTypesCached;
    }
  }
);

export const getAllPayType = createAsyncThunk<
  any[],
  {},
  ThunkApiType<RootState>
>(
  'getAllPayType',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let payTypes: ReportTableDataDto[] | undefined;

      if (userAuth?.auth_token) {
        payTypes = await new IncomeStatementsService(
          userAuth?.auth_token
        ).GetAllStatementsPayType();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!payTypes) {
        return rejectWithValue('Erro getting pay types');
      }

      return payTypes;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const submitIncomeStatement = createAsyncThunk<
  any[],
  {
    period: string;
    userId: string;
    month: number;
    year: number;
  },
  ThunkApiType<RootState>
>(
  'submitIncomeStatement',
  // eslint-disable-next-line no-empty-pattern
  async ({ year, month, period, userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let result: any | undefined;

      if (userAuth?.auth_token) {
        result = await new IncomeStatementsService(
          userAuth?.auth_token
        ).submitStatement({
          period,
          userId,
          month,
          year,
        });
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!result) {
        return rejectWithValue('Error submitting income statement');
      }
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getIncomeExpensesPDFreport = createAsyncThunk<
  any[],
  { year: Number; month: Number },
  ThunkApiType<RootState>
>(
  'getIncomeExpensesPDFreport',
  // eslint-disable-next-line no-empty-pattern
  async ({ year, month }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let report: ReportTableDataDto[] | undefined;

      if (userAuth?.auth_token) {
        report = await new IncomeStatementsService(
          userAuth?.auth_token
        ).getMonthsIncomeExpensesReport(userAuth?.id!, month, year);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!report) {
        return rejectWithValue('Error getting pdf Report Data');
      }
      return report;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saveIncomeStatementPDF = createAsyncThunk<
  boolean,
  IncomeStatementPDFDocInput,
  ThunkApiType<RootState>
>(
  'saveIncomeStatementPDF',

  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      let report: boolean | undefined;

      if (userAuth?.auth_token) {
        report = await new IncomeStatementsService(
          userAuth?.auth_token
        ).saveIncomeStatementPDF(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!report) {
        return rejectWithValue('Error getting pdf Report Data');
      }
      return report;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
