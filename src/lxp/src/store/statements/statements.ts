import { ExpenseItemDto, IncomeItemDto } from '@/../../../packages/core/lib';
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
  balanceMessageDismissed: false,
  downloadsMessageDismissed: false,
  expensesTypes: undefined,
  incomeTypes: undefined,
  payTypes: undefined,
  incomeStatements: [],
};

const statementsSlice = createSlice({
  name: 'statements',
  initialState,
  reducers: {
    resetStatementsStaticState: (state) => {
      state.expensesTypes = initialState.expensesTypes;
      state.incomeTypes = initialState.incomeTypes;
      state.payTypes = initialState.payTypes;
    },
    resetStatementsState: (state) => {
      state.incomeStatements = initialState.incomeStatements;
    },
    dismissBalanceMessage: (state) => {
      state.balanceMessageDismissed = true;
    },
    dismissDownloadsMessage: (state) => {
      state.downloadsMessageDismissed = true;
    },
    markStatementAsDownloaded: (
      state,
      action: PayloadAction<{ statementId: string }>
    ) => {
      const { statementId } = action.payload;

      // Get by statement Id or the month/year of the income item
      let updatedStatement = state.incomeStatements.find(
        (x) => x.id === statementId
      );

      if (!updatedStatement) {
        return;
      }

      state.balanceMessageDismissed = false;
      state.downloadsMessageDismissed = false;

      state.incomeStatements = [
        ...state.incomeStatements.filter((x) => x.id !== statementId),
        {
          ...updatedStatement,
          synced: false,
          downloaded: true,
        },
      ];
    },
    addOrUpdateIncomeItems: (
      state,
      action: PayloadAction<{
        statementId?: string;
        incomeItems: IncomeItemDto[];
      }>
    ) => {
      const { incomeItems, statementId } = action.payload;

      if (!incomeItems.length) {
        return;
      }

      const dateReceived = new Date(incomeItems[0].dateReceived);
      const receivedMonth = dateReceived.getMonth() + 1;
      const receivedYear = dateReceived.getFullYear();

      // Get by statement Id or the month/year of the income item
      let updatedStatement = !!statementId
        ? state.incomeStatements.find((x) => x.id === statementId)
        : state.incomeStatements.find(
            (x) => x.month === receivedMonth && x.year === receivedYear
          );

      if (!!updatedStatement?.downloaded) {
        return;
      }

      // If nothing found, then create one
      if (!updatedStatement) {
        updatedStatement = {
          id: newGuid(),
          month: receivedMonth,
          year: receivedYear,
          contactedByCoach: false,
          downloaded: false,
          incomeItems: [],
          expenseItems: [],
          synced: false,
          dateRefreshed: undefined,
        };
      }

      state.incomeStatements = [
        ...state.incomeStatements.filter((x) => x.id !== updatedStatement!.id),
        {
          ...updatedStatement,
          synced: false,
          incomeItems: [
            ...updatedStatement.incomeItems.filter(
              (x) =>
                !action.payload.incomeItems.some(
                  (updatedItem) => updatedItem.id === x.id
                )
            ),
            ...incomeItems,
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

      if (!!updatedStatement?.downloaded) {
        return;
      }

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
      if (!updatedStatement || updatedStatement.downloaded) {
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
