import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getAllExpenses,
  getAllExpensesTypes,
  getAllIncome,
  getAllIncomeTypes,
  getAllPayType,
  getAllStatementsContributionType,
  getAllStatementsFeeType,
} from './statements.actions';
import { StatementsState } from './statements.types';

const initialState: StatementsState = {
  income: undefined,
  expenses: undefined,
  expensesTypes: undefined,
  incomeTypes: undefined,
  feeTypes: undefined,
  contributionTypes: undefined,
  payTypes: undefined,
};

const statementsSlice = createSlice({
  name: 'statements',
  initialState,
  reducers: {
    resetStatementsState: (state) => {
      state.income = initialState.income;
      state.expenses = initialState.expenses;
      state.expensesTypes = initialState.expensesTypes;
      state.incomeTypes = initialState.incomeTypes;
      state.feeTypes = initialState.feeTypes;
      state.contributionTypes = initialState.contributionTypes;
    },
    updateStatements: (state, action: PayloadAction<any>) => {
      if (state.income) {
        state.income = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllExpenses.fulfilled, (state, action) => {
      state.expenses = action.payload;
    });
    builder.addCase(getAllExpensesTypes.fulfilled, (state, action) => {
      state.expensesTypes = action.payload;
    });
    builder.addCase(getAllIncome.fulfilled, (state, action) => {
      state.expenses = action.payload;
    });
    builder.addCase(getAllIncomeTypes.fulfilled, (state, action) => {
      state.incomeTypes = action.payload;
    });
    builder.addCase(getAllStatementsFeeType.fulfilled, (state, action) => {
      state.feeTypes = action.payload;
    });
    builder.addCase(
      getAllStatementsContributionType.fulfilled,
      (state, action) => {
        state.contributionTypes = action.payload;
      }
    );
    builder.addCase(getAllPayType.fulfilled, (state, action) => {
      state.payTypes = action.payload;
    });
  },
});

const { reducer: statementsReducer, actions: statementsActions } =
  statementsSlice;

const statementsPersistConfig = {
  key: 'statements',
  storage: localForage,
  blacklist: [],
};

export { statementsPersistConfig, statementsReducer, statementsActions };
