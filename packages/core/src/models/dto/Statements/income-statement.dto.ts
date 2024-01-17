import { ExpenseItemMinDto } from './expense-item.dto';
import { IncomeItemMinDto } from './income-item.dto';

export interface IncomeStatementDto {
  id: string;
  month: number;
  year: number;
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  incomeItems: IncomeItemMinDto[];
  expenseItems: ExpenseItemMinDto[];
  contactedByCoach: boolean;
}
