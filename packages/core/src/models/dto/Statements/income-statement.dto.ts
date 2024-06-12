import { ExpenseItemDto } from './expense-item.dto';
import { IncomeItemDto } from './income-item.dto';

export interface IncomeStatementDto {
  id: string;
  month: number;
  year: number;
  downloaded: boolean;
  incomeItems: IncomeItemDto[];
  expenseItems: ExpenseItemDto[];
  contactedByCoach: boolean;
}
