import { ExpenseItemDto, IncomeItemDto } from '@ecdlink/core';

export interface AddIncomeState {
  setType: (arg0: string) => void;
  onSubmit: (incomeItem: IncomeItemDto) => void;
}

export interface AddExpenseState {
  setType: (arg0: string) => void;
  onSubmit: (incomeItem: ExpenseItemDto) => void;
}

export const ContributionTypes = [
  {
    id: 1,
    type: 'Money',
  },
  {
    id: 2,
    type: 'Credit card',
  },
];

export const FeeTypes = [
  {
    id: 1,
    type: 'Regular preschool fee',
  },
  {
    id: 2,
    type: 'Aftercare fee',
  },
  {
    id: 3,
    type: 'Transport fee',
  },
  {
    id: 4,
    type: 'Other',
  },
];
