import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import {
  ExpensesStatementsTypes,
  IncomeStatementsTypes,
  IncomeStatementDto,
  StatementsPayTypes,
} from '@/../../../packages/core/lib';
import { OverrideCache } from '@/models/sync/override-cache';
import { differenceInMonths } from '@/utils/common/date.utils';

export const StatementsActions = {
  GET_STATEMENTS: 'getIncomeStatements',
  UPDATE_INCOME_STATEMENT: 'updateIncomeStatement',
  UPSERT_INCOME_STATEMENTS: 'upsertIncomeStatements',
};

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
          expensesTypes = await new IncomeStatementsService(
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
      statements: { payTypes: payTypesCached },
    } = getState();

    if (!payTypesCached) {
      try {
        let payTypes: StatementsPayTypes[] | undefined;

        if (userAuth?.auth_token) {
          payTypes = await new IncomeStatementsService(
            userAuth?.auth_token
          ).GetAllStatementsPayType();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!payTypes) {
          return rejectWithValue('Error getting pay types');
        }

        return payTypes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return payTypesCached;
    }
  }
);

export const getIncomeStatements = createAsyncThunk<
  IncomeStatementDto[],
  { startDate: Date; endDate: Date | undefined } & OverrideCache,
  ThunkApiType<RootState>
>(
  StatementsActions.GET_STATEMENTS,
  // eslint-disable-next-line no-empty-pattern
  async (
    { startDate, endDate, overrideCache },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      statements: { incomeStatements: cache },
    } = getState();

    let oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const statementsInRange = cache.filter(
      (x) =>
        new Date(x.year, x.month, 20) > startDate &&
        (!endDate || new Date(x.year, x.month, 20) < endDate)
    );

    const anyStale = statementsInRange.some(
      (x) => !x.dateRefreshed || new Date(x.dateRefreshed) < oneDayAgo
    );

    const allLoaded =
      differenceInMonths(startDate, endDate || new Date()) ===
      statementsInRange.length;

    // If there are any unsynced statements in the range, do not fetch, just return cache to prevent overwiting local data
    if (statementsInRange.some((x) => !x.synced)) {
      return statementsInRange;
    }

    if (!!overrideCache || anyStale || !allLoaded) {
      try {
        let incomeStatements: IncomeStatementDto[] | undefined;

        if (userAuth?.auth_token) {
          incomeStatements = await new IncomeStatementsService(
            userAuth?.auth_token
          ).getIncomeStatements(userAuth?.id, startDate, endDate);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!incomeStatements) {
          return rejectWithValue('Error getting income balance sheets');
        }

        return incomeStatements;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return statementsInRange;
    }
  }
);

export const updateIncomeStatement = createAsyncThunk<
  IncomeStatementDto,
  { statement: IncomeStatementDto },
  ThunkApiType<RootState>
>(
  StatementsActions.UPDATE_INCOME_STATEMENT,
  async ({ statement }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let result: IncomeStatementDto | undefined;

      if (userAuth?.auth_token) {
        result = await new IncomeStatementsService(
          userAuth?.auth_token
        ).updateStatement(statement as IncomeStatementDto);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!result) {
        return rejectWithValue('Error updating income statement');
      }
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const upsertIncomeStatements = createAsyncThunk<
  IncomeStatementDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  StatementsActions.UPSERT_INCOME_STATEMENTS,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      statements: { incomeStatements },
    } = getState();

    try {
      let promises: Promise<IncomeStatementDto>[] = [];
      if (userAuth?.auth_token) {
        promises = incomeStatements
          .filter((statement) => !statement.synced)
          .map(async (statement) => {
            return await new IncomeStatementsService(
              userAuth?.auth_token
            ).updateStatement(statement as IncomeStatementDto);
          });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
