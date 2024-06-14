import {
  ExpenseItemDto,
  IncomeItemDto,
  IncomeStatementDto,
} from '@/../../../packages/core/lib';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getAllExpensesTypes,
  getAllIncomeTypes,
  getAllPayType,
  getIncomeStatements,
} from './statements.actions';
import { StatementsState } from './statements.types';
import { newGuid } from '@/utils/common/uuid.utils';

const initialState: StatementsState = {
  expensesTypes: undefined,
  incomeTypes: undefined,
  payTypes: undefined,
  incomeStatements: [],
};

const statementsSlice = createSlice({
  name: 'statements',
  initialState,
  reducers: {
    resetStatementsState: (state) => {
      state.expensesTypes = initialState.expensesTypes;
      state.incomeTypes = initialState.incomeTypes;
      state.incomeStatements = initialState.incomeStatements;
      state.payTypes = initialState.payTypes;
    },
    createStatement: (state, action: PayloadAction<IncomeStatementDto>) => {
      state.incomeStatements = [
        ...state.incomeStatements,
        {
          ...action.payload,
          synced: false,
          dateRefreshed: new Date().toString(),
        },
      ];
    },
    addIncomeItem: (state, action: PayloadAction<IncomeItemDto>) => {
      const dateReceived = new Date(action.payload.dateReceived);
      const receivedMonth = dateReceived.getMonth() + 1;
      const receivedYear = dateReceived.getFullYear();

      const updatedStatement = state.incomeStatements.find(
        (x) => x.month === receivedMonth && x.year === receivedYear
      );

      if (!updatedStatement) {
        // No statement for the month yet, so add one
        state.incomeStatements = [
          ...state.incomeStatements,
          {
            id: newGuid(),
            contactedByCoach: false,
            year: receivedYear,
            month: receivedMonth,
            downloaded: false,
            synced: false,
            dateRefreshed: undefined,
            incomeItems: [action.payload],
            expenseItems: [],
          },
        ];
      } else {
        // Add item to existing statement
        state.incomeStatements = [
          ...state.incomeStatements.filter((x) => x.id !== updatedStatement.id),
          {
            ...updatedStatement,
            synced: false,
            incomeItems: [...updatedStatement.incomeItems, action.payload],
          },
        ];
      }
    },
    updateIncomeItem: (
      state,
      action: PayloadAction<{ statementId: string; incomeItem: IncomeItemDto }>
    ) => {
      const updatedStatement = state.incomeStatements.find(
        (x) => x.id === action.payload.statementId
      );
      if (!updatedStatement) {
        return;
      }
      state.incomeStatements = [
        ...state.incomeStatements.filter(
          (x) => x.id !== action.payload.statementId
        ),
        {
          ...updatedStatement,
          synced: false,
          incomeItems: [
            ...updatedStatement.incomeItems.filter(
              (x) => x.id !== action.payload.incomeItem.id
            ),
            action.payload.incomeItem,
          ],
        },
      ];
    },
    addExpenseItem: (state, action: PayloadAction<ExpenseItemDto>) => {
      const datePaid = new Date(action.payload.datePaid);
      const paidMonth = datePaid.getMonth() + 1;
      const paidYear = datePaid.getFullYear();

      const updatedStatement = state.incomeStatements.find(
        (x) => x.month === paidMonth && x.year === paidYear
      );

      if (!updatedStatement) {
        // No statement for the month yet, so add one
        state.incomeStatements = [
          ...state.incomeStatements,
          {
            id: newGuid(),
            contactedByCoach: false,
            year: paidYear,
            month: paidMonth,
            downloaded: false,
            synced: false,
            dateRefreshed: undefined,
            incomeItems: [],
            expenseItems: [action.payload],
          },
        ];
      } else {
        // Add item to existing statement
        state.incomeStatements = [
          ...state.incomeStatements.filter((x) => x.id !== updatedStatement.id),
          {
            ...updatedStatement,
            synced: false,
            expenseItems: [...updatedStatement.expenseItems, action.payload],
          },
        ];
      }
    },
    updateExpenseItem: (
      state,
      action: PayloadAction<{
        statementId: string;
        expenseItem: ExpenseItemDto;
      }>
    ) => {
      const updatedStatement = state.incomeStatements.find(
        (x) => x.id === action.payload.statementId
      );
      if (!updatedStatement) {
        return;
      }
      state.incomeStatements = [
        ...state.incomeStatements.filter(
          (x) => x.id !== action.payload.statementId
        ),
        {
          ...updatedStatement,
          synced: false,
          expenseItems: [
            ...updatedStatement.expenseItems.filter(
              (x) => x.id !== action.payload.expenseItem.id
            ),
            action.payload.expenseItem,
          ],
        },
      ];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllExpensesTypes.fulfilled, (state, action) => {
      state.expensesTypes = action.payload;
    });
    builder.addCase(getAllIncomeTypes.fulfilled, (state, action) => {
      state.incomeTypes = action.payload;
    });
    builder.addCase(getAllPayType.fulfilled, (state, action) => {
      state.payTypes = action.payload;
    });
    builder.addCase(getIncomeStatements.fulfilled, (state, action) => {
      if (action.payload && action.payload.length) {
        state.incomeStatements = [
          ...state.incomeStatements.filter(
            (x) =>
              new Date(x.year, x.month, 20) < action.meta.arg.startDate ||
              (!!action.meta.arg.endDate &&
                new Date(x.year, x.month, 20) > action.meta.arg.endDate)
          ),
          ...action.payload.map((item) => ({
            ...item,
            synced: true,
            dateRefreshed: new Date().toString(),
          })),
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
