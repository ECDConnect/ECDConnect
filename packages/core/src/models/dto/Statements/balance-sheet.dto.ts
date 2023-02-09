export interface BalanceSheetDto {
  __typename?: string;
  balance: number;
  expenseTotal: number;
  incomeTotal: number;
  month?: number;
  userId?: number;
  year: number;
}
