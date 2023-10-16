import { ExpenseItemMinDto } from '@/../../../packages/core/lib';

export interface ExpenseDetailsListProps {
  hideDetails?: () => void;
  statementTitle: string;
  expenseItems: ExpenseItemMinDto[];
  statementMonth: number;
}
