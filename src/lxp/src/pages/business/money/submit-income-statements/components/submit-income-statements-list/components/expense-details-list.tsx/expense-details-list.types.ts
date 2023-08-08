import { ExpensesStatementsDto } from '@/../../../packages/core/lib';

export interface ExpenseDetailsListProps {
  hideDetails?: () => void;
  statementTitle: string;
  incomeStatements?: ExpensesStatementsDto[];
}
