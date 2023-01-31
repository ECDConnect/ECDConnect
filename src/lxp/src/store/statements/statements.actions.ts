import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import ExpensesStatementsService from '@/services/ExpensesStatementsService/ExpensesStatementsService';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import {
  ExpensesStatementsDto,
  ExpensesStatementsTypes,
  IncomeStatementsDto,
  IncomeStatementsTypes,
  StatementsContributionTypes,
} from '@/../../../packages/core/lib';

export const getAllExpenses = createAsyncThunk<
  any[],
  {},
  ThunkApiType<RootState>
>(
  'getAllExpenses',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let expenses: ExpensesStatementsDto[] | undefined;

      if (userAuth?.auth_token) {
        expenses = await new ExpensesStatementsService(
          userAuth?.auth_token
        ).allStatementsExpenses(userAuth?.id);
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
    } = getState();

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
  }
);

export const getAllIncome = createAsyncThunk<
  any[],
  {},
  ThunkApiType<RootState>
>(
  'getAllIncome',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let income: IncomeStatementsDto[] | undefined;

      if (userAuth?.auth_token) {
        income = await new IncomeStatementsService(
          userAuth?.auth_token
        ).allStatementsIncome(userAuth?.id);
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

export const getAllIncomeTypes = createAsyncThunk<
  any[],
  {},
  ThunkApiType<RootState>
>(
  'getAllIncomeTypes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

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
    } = getState();

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
    } = getState();

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
      let payTypes: any[] | undefined;

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
