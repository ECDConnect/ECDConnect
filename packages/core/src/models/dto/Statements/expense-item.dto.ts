export type ExpenseItemMinDto = {
  expenseTypeId: string;
  id: string;
  datePaid: string;
  amount: number;
};

export type ExpenseItemDto = ExpenseItemMinDto & {
  notes?: string;
  photoProof?: string;
};
