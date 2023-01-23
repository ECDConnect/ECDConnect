import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getAllExpenses } from './statements.actions';
import { StatementsState } from './statements.types';

const initialState: StatementsState = {
  income: undefined,
  expenses: undefined,
};

const statementsSlice = createSlice({
  name: 'statements',
  initialState,
  reducers: {
    resetStatementsState: (state) => {
      state.income = initialState.income;
      state.expenses = initialState.expenses;
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
