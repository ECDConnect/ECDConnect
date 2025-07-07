import { OfflineCache } from '@/models/sync/offline-cache';
import { OfflineUpdate } from '@/models/sync/offline-update';
import {
  ExpensesStatementsTypes,
  IncomeStatementDto,
  IncomeStatementsTypes,
  StatementsPayTypes,
} from '@ecdlink/core';

export interface StatementsState {
  balanceMessageDismissed: boolean;
  downloadsMessageDismissed: boolean;
  expensesTypes: ExpensesStatementsTypes[] | undefined;
  incomeTypes: IncomeStatementsTypes[] | undefined;
  payTypes: StatementsPayTypes[] | undefined;
  incomeStatements: (IncomeStatementDto & OfflineUpdate & OfflineCache)[];
}
