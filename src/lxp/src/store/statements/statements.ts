import { IncomeStatementsDto } from '@/../../../packages/core/lib';
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
  getAllStatementsBalanceSheet,
  getIncomeExpensesPDFreport,
  submitIncomeStatement,
} from './statements.actions';
import { StatementsState } from './statements.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: StatementsState = {
  income: undefined,
  expenses: undefined,
  expensesTypes: undefined,
  incomeTypes: undefined,
  feeTypes: undefined,
  contributionTypes: undefined,
  payTypes: undefined,
  balanceSheet: undefined,
  pdfReportData: undefined,
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
      state.balanceSheet = initialState.balanceSheet;
      state.pdfReportData = initialState.pdfReportData;
    },
    updateStatements: (state, action: PayloadAction<any>) => {
      if (state.income) {
        state.income = action.payload;
      }
    },
    addIncome: (state, action: PayloadAction<IncomeStatementsDto>) => {
      if (!state.income) state.income = [];
      state.income?.push(action.payload);
    },
    addExpenses: (state, action: PayloadAction<any>) => {
      if (!state.expenses) state.expenses = [];
      state.expenses?.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, submitIncomeStatement);
    builder.addCase(getAllExpenses.fulfilled, (state, action) => {
      state.expenses = action.payload;
    });
    builder.addCase(getAllExpensesTypes.fulfilled, (state, action) => {
      state.expensesTypes = action.payload;
    });
    builder.addCase(getAllIncome.fulfilled, (state, action) => {
      state.income = action.payload;
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
    builder.addCase(getAllStatementsBalanceSheet.fulfilled, (state, action) => {
      state.balanceSheet = action.payload;
    });

    builder.addCase(getIncomeExpensesPDFreport.fulfilled, (state, action) => {
      state.pdfReportData = action.payload;
    });
    builder.addCase(submitIncomeStatement.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
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
