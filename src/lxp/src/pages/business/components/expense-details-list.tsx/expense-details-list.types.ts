import { ExpenseItemDto } from '@/../../../packages/core/lib';

export interface ExpenseDetailsListProps {
  hideDetails?: () => void;
  statementTitle: string;
  expenseItems: ExpenseItemDto[];
  statementMonth: number;
  statementId: string;
}
