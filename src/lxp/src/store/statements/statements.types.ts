import { OfflineCache } from '@/models/sync/offline-cache';
import { OfflineUpdate } from '@/models/sync/offline-update';
import {
  ExpensesStatementsTypes,
  IncomeStatementDto,
  IncomeStatementsTypes,
  StatementsPayTypes,
} from '@ecdlink/core';

/**
 * Ids of the items changed on this device since the statement last synced.
 * Only these items are sent, so unchanged (possibly stale) copies never
 * overwrite edits made on another device. Undefined on an unsynced statement
 * means it was changed before tracking existed, so every item is sent.
 */
export type UnsyncedStatementItems = {
  unsyncedIncomeItemIds?: string[];
  unsyncedExpenseItemIds?: string[];
};

export type LocalIncomeStatement = IncomeStatementDto &
  OfflineUpdate &
  OfflineCache &
  UnsyncedStatementItems;

export interface StatementsState {
  balanceMessageDismissed: boolean;
  downloadsMessageDismissed: boolean;
  expensesTypes: ExpensesStatementsTypes[] | undefined;
  incomeTypes: IncomeStatementsTypes[] | undefined;
  payTypes: StatementsPayTypes[] | undefined;
  incomeStatements: LocalIncomeStatement[];
}
