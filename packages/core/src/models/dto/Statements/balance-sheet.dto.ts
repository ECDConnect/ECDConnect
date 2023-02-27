export interface BalanceSheetDto {
  __typename?: string;
  balance: number;
  expenseTotal: number;
  incomeTotal: number;
  month?: number;
  userId?: number;
  year: number;
  submitted?: boolean;
  autoSubmitted?: boolean;
  submittedDate?: string;
}
