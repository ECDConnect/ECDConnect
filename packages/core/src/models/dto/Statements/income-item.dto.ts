export type IncomeItemMinDto = {
  incomeTypeId: string;
  id: string;
  dateReceived: string;
  amount: number;
  childUserId?: string;
};

export type IncomeItemDto = IncomeItemMinDto & {
  notes?: string;
  description?: string;
  amountExpected?: number;
  childCoverAmount?: number;
  payTypeId?: string;
  contributionTypeId?: string;
  photoProof?: string;
  insertedDate?: string;
  isOffline?: boolean;
  feeTypeId?: string;
};
