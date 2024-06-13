import { OfflineCache } from '@/models/sync/offline-cache';
import { OfflineUpdate } from '@/models/sync/offline-update';
import {
  ExpensesStatementsTypes,
  IncomeStatementDto,
  IncomeStatementsTypes,
  StatementsContributionTypes,
  StatementsFeeTypes,
  StatementsPayTypes,
} from '@ecdlink/core';

export interface StatementsState {
  expensesTypes: ExpensesStatementsTypes[] | undefined;
  incomeTypes: IncomeStatementsTypes[] | undefined;
  payTypes: StatementsPayTypes[] | undefined;

  // I don't think these two will be needed anymore after FE updates
  contributionTypes: StatementsContributionTypes[] | undefined;
  feeTypes: StatementsFeeTypes[] | undefined;

  incomeStatementsData: {
    incomeStatements: (IncomeStatementDto & OfflineUpdate)[];
  } & OfflineCache;
}
