import {
  StatementsExpensesInput,
  StatementsIncomeInput,
} from '@ecdlink/graphql';

export interface AddIncomeState {
  setType: (arg0: string) => void;
  onSubmit: (incomeItem: StatementsIncomeInput) => void;
}

export interface AddExpenseState {
  setType: (arg0: string) => void;
  onSubmit: (incomeItem: StatementsExpensesInput) => void;
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
