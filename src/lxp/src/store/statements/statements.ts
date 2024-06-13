import {
  ExpenseItemDto,
  IncomeItemDto,
  IncomeStatementDto,
  IncomeStatementsDto,
} from '@/../../../packages/core/lib';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getAllExpensesTypes,
  getAllIncomeTypes,
  getAllPayType,
  getAllStatementsContributionType,
  getAllStatementsFeeType,
  getIncomeStatements,
} from './statements.actions';
import { StatementsState } from './statements.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { s } from 'msw/lib/glossary-297d38ba';

const initialState: StatementsState = {
  expensesTypes: undefined,
  incomeTypes: undefined,
  feeTypes: undefined,
  contributionTypes: undefined,
  payTypes: undefined,
  incomeStatementsData: {
    incomeStatements: [],
    dateRefreshed: undefined,
  },
  //unSubmittedIncomeItems: [],
  //unSubmittedExpenseItems: [],
  //unsyncedIncomeItems: [],
  //unsyncedExpenseItems: [],
};

const statementsSlice = createSlice({
  name: 'statements',
  initialState,
  reducers: {
    resetStatementsState: (state) => {
      state.expensesTypes = initialState.expensesTypes;
      state.incomeTypes = initialState.incomeTypes;
      state.feeTypes = initialState.feeTypes;
      state.contributionTypes = initialState.contributionTypes;
      state.incomeStatementsData = initialState.incomeStatementsData;
      // state.unSubmittedIncomeItems = initialState.unSubmittedIncomeItems;
      // state.unSubmittedExpenseItems = initialState.unSubmittedExpenseItems;
      state.payTypes = initialState.payTypes;
    },
    createStatement: (state, action: PayloadAction<IncomeStatementDto>) => {
      console.log('creating statement');
      state.incomeStatementsData = {
        ...state.incomeStatementsData,
        incomeStatements: [
          ...state.incomeStatementsData.incomeStatements,
          {
            ...action.payload,
            synced: false,
          },
        ],
      };
    },
    addIncomeItem: (state, action: PayloadAction<IncomeItemDto>) => {
      const dateReceived = new Date(action.payload.dateReceived);
      const receivedMonth = dateReceived.getMonth() + 1;
      const receivedYear = dateReceived.getFullYear();
      for (
        let i = 0;
        i < state.incomeStatementsData.incomeStatements.length;
        i++
      ) {
        if (
          state.incomeStatementsData.incomeStatements[i].month ===
            receivedMonth &&
          state.incomeStatementsData.incomeStatements[i].year === receivedYear
        ) {
          state.incomeStatementsData.incomeStatements[i] = {
            ...state.incomeStatementsData.incomeStatements[i],
            incomeItems: [
              ...state.incomeStatementsData.incomeStatements[i].incomeItems,
              action.payload,
            ],
            synced: false,
          };
        }
      }
    },
    addExpenseItem: (state, action: PayloadAction<ExpenseItemDto>) => {
      const dateReceived = new Date(action.payload.datePaid);
      const receivedMonth = dateReceived.getMonth() + 1;
      const receivedYear = dateReceived.getFullYear();
      for (
        let i = 0;
        i < state.incomeStatementsData.incomeStatements.length;
        i++
      ) {
        if (
          state.incomeStatementsData.incomeStatements[i].month ===
            receivedMonth &&
          state.incomeStatementsData.incomeStatements[i].year === receivedYear
        ) {
          state.incomeStatementsData.incomeStatements[i] = {
            ...state.incomeStatementsData.incomeStatements[i],
            expenseItems: [
              ...state.incomeStatementsData.incomeStatements[i].expenseItems,
              action.payload,
            ],
            synced: false,
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    //setThunkActionStatus(builder, submitIncomeStatement);
    builder.addCase(getAllExpensesTypes.fulfilled, (state, action) => {
      state.expensesTypes = action.payload;
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
    builder.addCase(getIncomeStatements.fulfilled, (state, action) => {
      if (action.payload) {
        state.incomeStatementsData = {
          incomeStatements: action.payload.map((statement) => ({
            ...statement,
            synced: true,
          })),
          dateRefreshed: new Date().toDateString(),
        };
      }
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
