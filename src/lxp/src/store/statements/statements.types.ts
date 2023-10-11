import {
  ExpenseItemDto,
  ExpensesStatementsTypes,
  IncomeItemDto,
  IncomeStatementDto,
  IncomeStatementsTypes,
  StatementsContributionTypes,
  StatementsFeeTypes,
  StatementsPayTypes,
} from '@ecdlink/core';
import {
  StatementsExpensesInput,
  StatementsIncomeInput,
} from '@ecdlink/graphql';

export interface StatementsState {
  expensesTypes: ExpensesStatementsTypes[] | undefined;
  incomeTypes: IncomeStatementsTypes[] | undefined;
  feeTypes: StatementsFeeTypes[] | undefined;
  contributionTypes: StatementsContributionTypes[] | undefined;
  payTypes: StatementsPayTypes[] | undefined;

  incomeStatements: IncomeStatementDto[];
  unSubmittedIncomeItems: IncomeItemDto[];
  unSubmittedExpenseItems: ExpenseItemDto[];

  unsyncedIncomeItems: StatementsIncomeInput[];
  unsyncedExpenseItems: StatementsExpensesInput[];
}
