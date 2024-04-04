import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import {
  ExpensesStatementsTypes,
  IncomeStatementsTypes,
  StatementsContributionTypes,
  IncomeStatementDto,
  StatementsPayTypes,
  ExpenseItemDto,
  IncomeItemDto,
} from '@/../../../packages/core/lib';
import {
  StatementsExpensesInput,
  StatementsIncomeInput,
} from '@ecdlink/graphql';

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

export const submitIncomeStatement = createAsyncThunk<
  IncomeStatementDto,
  {
    userId: string;
    month: number;
    year: number;
    incomeItemIds: string[];
    expenseItemIds: string[];
  },
  ThunkApiType<RootState>
>(
  'submitIncomeStatement',
  // eslint-disable-next-line no-empty-pattern
  async (
    { year, month, userId, incomeItemIds, expenseItemIds },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let result: IncomeStatementDto | undefined;

      if (userAuth?.auth_token) {
        result = await new IncomeStatementsService(
          userAuth?.auth_token
        ).submitStatement({
          userId,
          month,
          year,
          incomeItemIds,
          expenseItemIds,
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

export const getIncomeStatements = createAsyncThunk<
  IncomeStatementDto[],
  { startDate: Date; endDate: Date | undefined },
  ThunkApiType<RootState>
>(
  'getIncomeStatements',
  // eslint-disable-next-line no-empty-pattern
  async ({ startDate, endDate }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

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
  }
);

export const getUnsubmittedIncomeItems = createAsyncThunk<
  IncomeItemDto[],
  {},
  ThunkApiType<RootState>
>(
  'getUnsubmittedIncomeItems',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let incomeItems: IncomeItemDto[] | undefined;

      if (userAuth?.auth_token) {
        incomeItems = await new IncomeStatementsService(
          userAuth?.auth_token
        ).getUnsubmittedIncomeItems(userAuth?.id);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!incomeItems) {
        return rejectWithValue('Error getting income balance sheets');
      }

      return incomeItems;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUnsubmittedExpenseItems = createAsyncThunk<
  ExpenseItemDto[],
  {},
  ThunkApiType<RootState>
>(
  'getUnsubmittedExpenseItems',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let expenseItems: ExpenseItemDto[] | undefined;

      if (userAuth?.auth_token) {
        expenseItems = await new IncomeStatementsService(
          userAuth?.auth_token
        ).getUnsubmittedExpenseItems(userAuth?.id);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!expenseItems) {
        return rejectWithValue('Error getting income balance sheets');
      }

      return expenseItems;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addIncomeItem = createAsyncThunk<
  IncomeItemDto,
  { input: StatementsIncomeInput; firstAttempt: boolean },
  ThunkApiType<RootState>
>(
  'addIncomeItem',
  // eslint-disable-next-line no-empty-pattern
  async ({ input }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let incomeItem: IncomeItemDto | undefined;

      if (userAuth?.auth_token) {
        incomeItem = await new IncomeStatementsService(
          userAuth?.auth_token
        ).UpdateStatementsIncome(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!incomeItem) {
        return rejectWithValue('Error uploading income item');
      }

      return incomeItem;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addExpenseItem = createAsyncThunk<
  ExpenseItemDto,
  { input: StatementsExpensesInput; firstAttempt: boolean },
  ThunkApiType<RootState>
>(
  'addExpenseItem',
  // eslint-disable-next-line no-empty-pattern
  async ({ input }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let expenseItem: ExpenseItemDto | undefined;

      if (userAuth?.auth_token) {
        expenseItem = await new IncomeStatementsService(
          userAuth?.auth_token
        ).updateStatementsExpense(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!expenseItem) {
        return rejectWithValue('Error uploading expense item');
      }

      return expenseItem;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
