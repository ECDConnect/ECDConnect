export type ExpenseItemMinDto = {
  expenseTypeId: string;
  id: string;
  datePaid: string;
  amount: number;
  description: string;
};

export type ExpenseItemDto = ExpenseItemMinDto & {
  notes?: string;
  photoProof?: string;
  isOffline?: boolean;
};
