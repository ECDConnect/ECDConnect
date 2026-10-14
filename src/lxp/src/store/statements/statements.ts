import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getAllExpensesTypes,
  getAllIncomeTypes,
  getAllPayType,
  getIncomeStatements,
  upsertIncomeStatements,
} from './statements.actions';
import {
  LocalIncomeStatement,
  StatementsState,
  UnsyncedStatementItems,
} from './statements.types';
import {
  IncomeStatementDto,
  IncomeItemDto,
  IncomeTypeIds,
  ExpenseItemDto,
} from '@ecdlink/core';
import { newGuid } from '@/utils/common/uuid.utils';

const statementMonthKey = (year: number, month: number) => `${year}-${month}`;

/** Backend month is 1-12; Date() months are 0-11. Day 20 avoids timezone month-shift. */
const statementSortDate = (year: number, month: number) =>
  new Date(year, month - 1, 20);

/** The parts of a statement that are sent to the server */
const statementContent = (statement: IncomeStatementDto) =>
  JSON.stringify({
    incomeItems: statement.incomeItems,
    expenseItems: statement.expenseItems,
    contactedByCoach: statement.contactedByCoach,
    downloaded: statement.downloaded,
  });

type UnsyncedIdsKey = keyof UnsyncedStatementItems;

/** Unsynced item ids before a new change; undefined means all items are unsynced */
const pendingItemIds = (statement: LocalIncomeStatement, key: UnsyncedIdsKey) =>
  statement.synced ? [] : statement[key];

const addUnsyncedItemIds = (
  statement: LocalIncomeStatement,
  key: UnsyncedIdsKey,
  ids: string[]
) => {
  const pending = pendingItemIds(statement, key);
  return pending === undefined
    ? undefined
    : Array.from(new Set([...pending, ...ids]));
};

/** Every item id that still has to be sent, with the legacy "all items" case expanded */
const allUnsyncedItemIds = (
  statement: LocalIncomeStatement,
  key: UnsyncedIdsKey
) =>
  pendingItemIds(statement, key) ??
  (key === 'unsyncedIncomeItemIds'
    ? statement.incomeItems
    : statement.expenseItems
  ).map((x) => x.id);

const isActivePreschoolFee = (item: IncomeItemDto) =>
  item.isActive && item.incomeTypeId === IncomeTypeIds.PRESCHOOL_FEE_ID;

const findStatementForMonth = (
  statements: StatementsState['incomeStatements'],
  year: number,
  month: number
) => {
  const matches = statements.filter(
    (x) => x.year === year && x.month === month
  );
  if (!matches.length) {
    return undefined;
  }
  return matches.find((x) => x.synced) ?? matches[0];
};

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
          unsyncedIncomeItemIds: addUnsyncedItemIds(
            updatedStatement,
            'unsyncedIncomeItemIds',
            []
          ),
          unsyncedExpenseItemIds: addUnsyncedItemIds(
            updatedStatement,
            'unsyncedExpenseItemIds',
            []
          ),
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

      let updatedStatement = statementId
        ? state.incomeStatements.find((x) => x.id === statementId)
        : undefined;

      if (!updatedStatement) {
        updatedStatement = findStatementForMonth(
          state.incomeStatements,
          receivedYear,
          receivedMonth
        );
      }

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
          unsyncedIncomeItemIds: [],
          unsyncedExpenseItemIds: [],
          synced: false,
          dateRefreshed: undefined,
        };
      }

      state.incomeStatements = [
        ...state.incomeStatements.filter((x) => x.id !== updatedStatement!.id),
        {
          ...updatedStatement,
          unsyncedIncomeItemIds: addUnsyncedItemIds(
            updatedStatement,
            'unsyncedIncomeItemIds',
            incomeItems.map((x) => x.id)
          ),
          unsyncedExpenseItemIds: addUnsyncedItemIds(
            updatedStatement,
            'unsyncedExpenseItemIds',
            []
          ),
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

      const updatedStatement = findStatementForMonth(
        state.incomeStatements,
        paidYear,
        paidMonth
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
            unsyncedIncomeItemIds: [],
            unsyncedExpenseItemIds: [action.payload.id],
          },
        ];
      } else {
        // Add item to existing statement
        state.incomeStatements = [
          ...state.incomeStatements.filter((x) => x.id !== updatedStatement.id),
          {
            ...updatedStatement,
            unsyncedIncomeItemIds: addUnsyncedItemIds(
              updatedStatement,
              'unsyncedIncomeItemIds',
              []
            ),
            unsyncedExpenseItemIds: addUnsyncedItemIds(
              updatedStatement,
              'unsyncedExpenseItemIds',
              [action.payload.id]
            ),
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
          unsyncedIncomeItemIds: addUnsyncedItemIds(
            updatedStatement,
            'unsyncedIncomeItemIds',
            []
          ),
          unsyncedExpenseItemIds: addUnsyncedItemIds(
            updatedStatement,
            'unsyncedExpenseItemIds',
            [action.payload.expenseItem.id]
          ),
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
    builder.addCase(upsertIncomeStatements.fulfilled, (state, action) => {
      const { sent, returned } = action.payload;
      if (!returned.length) {
        return;
      }

      // A local statement edited (or created) while the request was in flight
      // has changes the server has not seen, so it must stay unsynced.
      const sentById = new Map(sent.map((s) => [s.id, statementContent(s)]));
      const hasUnsentChanges = (
        statement: StatementsState['incomeStatements'][number]
      ) =>
        !statement.synced &&
        sentById.get(statement.id) !== statementContent(statement);

      const returnedByMonth = new Map<string, (typeof returned)[number]>();
      returned.forEach((item) => {
        returnedByMonth.set(statementMonthKey(item.year, item.month), item);
      });
      const uniqueReturned = Array.from(returnedByMonth.values());
      const returnedMonthKeys = new Set(returnedByMonth.keys());

      // Item content as it was sent, to tell whether a local item changed since
      const sentItems = new Map<string, string>();
      sent.forEach((s) =>
        [...(s.incomeItems ?? []), ...(s.expenseItems ?? [])].forEach((x) =>
          sentItems.set(x.id, JSON.stringify(x))
        )
      );
      const sentUnchanged = (item: { id: string }) =>
        sentItems.get(item.id) === JSON.stringify(item);

      // The server is the source of truth, except for local items it has not
      // seen yet (new, or changed on this device and not yet synced).
      const mergeItemsById = <T extends { id: string; isActive?: boolean }>(
        serverItems: T[] | undefined,
        localItems: T[],
        unsyncedIds: Set<string>
      ) => {
        const items = new Map<string, T>();
        (serverItems ?? []).forEach((item) => {
          if (item?.id) {
            items.set(item.id, item);
          }
        });
        localItems.forEach((item) => {
          if (!item?.id) {
            return;
          }
          const serverItem = items.get(item.id);
          if (!serverItem || unsyncedIds.has(item.id)) {
            items.set(item.id, item);
            return;
          }
          // A save response that leaves isActive off must not mark the item inactive.
          if (
            serverItem.isActive === undefined &&
            item.isActive !== undefined
          ) {
            items.set(item.id, { ...serverItem, isActive: item.isActive });
          }
        });
        return Array.from(items.values());
      };

      state.incomeStatements = [
        ...state.incomeStatements.filter(
          (s) => !returnedMonthKeys.has(statementMonthKey(s.year, s.month))
        ),
        ...uniqueReturned.map((item): LocalIncomeStatement => {
          const locals = state.incomeStatements.filter(
            (s) =>
              statementMonthKey(s.year, s.month) ===
              statementMonthKey(item.year, item.month)
          );

          // A downloaded statement is locked on the server, so local changes are discarded
          if (item.downloaded) {
            return {
              ...item,
              unsyncedIncomeItemIds: [],
              unsyncedExpenseItemIds: [],
              synced: true,
              dateRefreshed: new Date().toString(),
            };
          }

          const synced = !locals.some(hasUnsentChanges);
          const unsyncedIncomeIds = new Set(
            locals.flatMap((s) =>
              allUnsyncedItemIds(s, 'unsyncedIncomeItemIds')
            )
          );
          const unsyncedExpenseIds = new Set(
            locals.flatMap((s) =>
              allUnsyncedItemIds(s, 'unsyncedExpenseItemIds')
            )
          );

          // The server merges a second fee for the same child into the existing
          // one, so drop the local copy once the server has taken its values.
          const serverFeeChildIds = new Set(
            (item.incomeItems ?? [])
              .filter(isActivePreschoolFee)
              .map((x) => x.childUserId)
          );
          const serverIncomeIds = new Set(
            (item.incomeItems ?? []).map((x) => x.id)
          );
          const localIncomeItems = locals
            .flatMap((s) => s.incomeItems ?? [])
            .filter(
              (x) =>
                !(
                  isActivePreschoolFee(x) &&
                  !serverIncomeIds.has(x.id) &&
                  serverFeeChildIds.has(x.childUserId) &&
                  sentUnchanged(x)
                )
            );

          const localContactedByCoach = locals.find(
            (s) => typeof s.contactedByCoach === 'boolean'
          )?.contactedByCoach;

          return {
            ...item,
            // A save response that leaves this off must not drop a value the
            // device already has. The input field is required on the server.
            contactedByCoach:
              item.contactedByCoach ?? localContactedByCoach ?? false,
            incomeItems: mergeItemsById(
              item.incomeItems,
              localIncomeItems,
              unsyncedIncomeIds
            ),
            expenseItems: mergeItemsById(
              item.expenseItems,
              locals.flatMap((s) => s.expenseItems ?? []),
              unsyncedExpenseIds
            ),
            unsyncedIncomeItemIds: synced ? [] : Array.from(unsyncedIncomeIds),
            unsyncedExpenseItemIds: synced
              ? []
              : Array.from(unsyncedExpenseIds),
            synced,
            dateRefreshed: new Date().toString(),
          };
        }),
      ];
    });
    builder.addCase(getIncomeStatements.fulfilled, (state, action) => {
      if (!action.payload?.length) {
        return;
      }

      // The thunk returns the local cache when a statement in range is still
      // unsynced. Writing it back with synced: true lets the in-flight save
      // response replace those items with a payload that omits isActive, so
      // the Money tab treats the new income as empty until the next fetch.
      if (
        action.payload.some(
          (item) => (item as LocalIncomeStatement).synced === false
        )
      ) {
        return;
      }

      const { startDate, endDate } = action.meta.arg;
      const fetched = action.payload.map((item) => ({
        ...item,
        synced: true,
        dateRefreshed: new Date().toString(),
      }));
      const fetchedMonthKeys = new Set(
        fetched.map((s) => statementMonthKey(s.year, s.month))
      );

      state.incomeStatements = [
        ...state.incomeStatements.filter((x) => {
          if (fetchedMonthKeys.has(statementMonthKey(x.year, x.month))) {
            return false;
          }
          const date = statementSortDate(x.year, x.month);
          return date < startDate || (!!endDate && date > endDate);
        }),
        ...fetched,
      ];
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
