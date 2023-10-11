import { IncomeStatementsDto } from '@/../../../packages/core/lib';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getAllExpensesTypes,
  getAllIncomeTypes,
  getAllPayType,
  getAllStatementsContributionType,
  getAllStatementsFeeType,
  submitIncomeStatement,
  getIncomeStatements,
  getUnsubmittedIncomeItems,
  getUnsubmittedExpenseItems,
  addIncomeItem,
  addExpenseItem,
} from './statements.actions';
import { StatementsState } from './statements.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: StatementsState = {
  expensesTypes: undefined,
  incomeTypes: undefined,
  feeTypes: undefined,
  contributionTypes: undefined,
  payTypes: undefined,
  incomeStatements: [],
  unSubmittedIncomeItems: [],
  unSubmittedExpenseItems: [],
  unsyncedIncomeItems: [],
  unsyncedExpenseItems: [],
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
      state.incomeStatements = initialState.incomeStatements;
      state.unSubmittedIncomeItems = initialState.unSubmittedIncomeItems;
      state.unSubmittedExpenseItems = initialState.unSubmittedExpenseItems;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, submitIncomeStatement);
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
    builder.addCase(submitIncomeStatement.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
      state.incomeStatements = [...state.incomeStatements, action.payload];
      state.unsyncedIncomeItems = [
        ...state.unsyncedIncomeItems.filter((x) =>
          action.payload.incomeItems.some((y) => y.id === x.Id)
        ),
      ];
      state.unsyncedExpenseItems = [
        ...state.unsyncedExpenseItems.filter((x) =>
          action.payload.expenseItems.some((y) => y.id === x.Id)
        ),
      ];
    });
    builder.addCase(getIncomeStatements.fulfilled, (state, action) => {
      state.incomeStatements = action.payload;
    });
    builder.addCase(getUnsubmittedIncomeItems.fulfilled, (state, action) => {
      state.unSubmittedIncomeItems = action.payload;
    });
    builder.addCase(getUnsubmittedExpenseItems.fulfilled, (state, action) => {
      state.unSubmittedExpenseItems = action.payload;
    });
    builder.addCase(addIncomeItem.fulfilled, (state, action) => {
      const index = state.unSubmittedIncomeItems.findIndex(
        (x) => x.id === action.payload.id
      );

      if (index < 0) {
        state.unSubmittedIncomeItems = [
          ...state.unSubmittedIncomeItems,
          action.payload,
        ];
      } else {
        state.unSubmittedIncomeItems = [
          ...state.unSubmittedIncomeItems.slice(0, index),
          action.payload,
          ...state.unSubmittedIncomeItems.slice(index + 1),
        ];
      }

      // Remove from unsynced
      const unsyncedIndex = state.unsyncedIncomeItems.findIndex(
        (x) => x.Id === action.payload.id
      );

      if (unsyncedIndex >= 0) {
        state.unsyncedIncomeItems = [
          ...state.unsyncedIncomeItems.slice(0, unsyncedIndex),
          ...state.unsyncedIncomeItems.slice(unsyncedIndex + 1),
        ];
      }
    });
    builder.addCase(addIncomeItem.rejected, (state, action) => {
      if (action.meta.arg.firstAttempt) {
        const input = action.meta.arg.input;
        state.unsyncedIncomeItems = [...state.unsyncedIncomeItems, input];

        // Map and add to our unsubmitted items
        state.unSubmittedIncomeItems = [
          ...state.unSubmittedIncomeItems,
          {
            amount: input.Amount,
            dateReceived: input.DateReceived,
            id: input.Id,
            incomeTypeId: input.IncomeTypeId!,
            childUserId: input.ChildUserId as string,
          },
        ];
      }
    });
    builder.addCase(addExpenseItem.fulfilled, (state, action) => {
      const index = state.unSubmittedExpenseItems.findIndex(
        (x) => x.id === action.payload.id
      );

      if (index < 0) {
        state.unSubmittedExpenseItems = [
          ...state.unSubmittedExpenseItems,
          action.payload,
        ];
      } else {
        state.unSubmittedExpenseItems = [
          ...state.unSubmittedExpenseItems.slice(0, index),
          action.payload,
          ...state.unSubmittedExpenseItems.slice(index + 1),
        ];
      }

      // Remove from unsynced
      const unsyncedIndex = state.unsyncedExpenseItems.findIndex(
        (x) => x.Id === action.payload.id
      );

      if (unsyncedIndex >= 0) {
        state.unsyncedExpenseItems = [
          ...state.unsyncedExpenseItems.slice(0, unsyncedIndex),
          ...state.unsyncedExpenseItems.slice(unsyncedIndex + 1),
        ];
      }
    });
    builder.addCase(addExpenseItem.rejected, (state, action) => {
      if (action.meta.arg.firstAttempt) {
        const input = action.meta.arg.input;
        state.unsyncedExpenseItems = [...state.unsyncedExpenseItems, input];

        // Map and add to our unsubmitted items
        state.unSubmittedExpenseItems = [
          ...state.unSubmittedExpenseItems,
          {
            amount: input.Amount,
            datePaid: input.DatePaid,
            id: input.Id,
            expenseTypeId: input.ExpenseTypeId!,
            description: input.Description || '',
          },
        ];
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
