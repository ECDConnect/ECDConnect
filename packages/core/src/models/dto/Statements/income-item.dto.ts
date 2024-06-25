export type IncomeItemMinDto = {
  incomeTypeId: string;
  id: string;
  dateReceived: string;
  amount: number;
  childUserId?: string;
};

export type IncomeItemDto = IncomeItemMinDto & {
  description?: string;
  notes?: string;
  numberOfChildrenCovered?: number;
  payTypeId?: string;
  photoProof?: string;
};
