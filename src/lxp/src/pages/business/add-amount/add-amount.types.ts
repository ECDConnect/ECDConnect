import { ExpenseItemDto, IncomeItemDto } from '@ecdlink/core';

export interface AddIncomeProps {
  onBack: () => void;
  onSubmit: (incomeItem: IncomeItemDto) => void;
  incomeItem?: IncomeItemDto;
}

export interface AddExpenseState {
  onBack: () => void;
  onSubmit: (incomeItem: ExpenseItemDto) => void;
  expenseItem?: ExpenseItemDto;
}

export interface AddPreschoolFeesProps {
  onBack: () => void;
  incomeItem?: IncomeItemDto;
}
