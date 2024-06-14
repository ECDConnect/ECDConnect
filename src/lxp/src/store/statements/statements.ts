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
      // TODO - need to add logic to create a statement if one does not exist for the given date
      const dateReceived = new Date(action.payload.dateReceived);
      const receivedMonth = dateReceived.getMonth() + 1;
      const receivedYear = dateReceived.getFullYear();
      for (let i = 0; i < state.incomeStatements.length; i++) {
        if (
          state.incomeStatements[i].month === receivedMonth &&
          state.incomeStatements[i].year === receivedYear
        ) {
          state.incomeStatements[i] = {
            ...state.incomeStatements[i],
            incomeItems: [
              ...state.incomeStatements[i].incomeItems,
              action.payload,
            ],
            synced: false,
          };
        }
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
      const dateReceived = new Date(action.payload.datePaid);
      const receivedMonth = dateReceived.getMonth() + 1;
      const receivedYear = dateReceived.getFullYear();
      for (let i = 0; i < state.incomeStatements.length; i++) {
        if (
          state.incomeStatements[i].month === receivedMonth &&
          state.incomeStatements[i].year === receivedYear
        ) {
          state.incomeStatements[i] = {
            ...state.incomeStatements[i],
            expenseItems: [
              ...state.incomeStatements[i].expenseItems,
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
        console.log('state.incomeStatements', state.incomeStatements);
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
