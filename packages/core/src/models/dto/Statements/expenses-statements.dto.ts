export interface ExpensesStatementsDto {
  amount?: number;
  datePaid?: string;
  description?: string;
  expenseTypeId?: string;
  id?: string;
  statementsIncomeStatementId?: string;
  insertedDate?: string;
  notes?: string;
  photoProof?: boolean;
  submitted?: boolean;
  userId?: string;
  isOffline?: boolean;
}
