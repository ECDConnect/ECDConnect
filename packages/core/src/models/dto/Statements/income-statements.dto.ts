export interface IncomeStatementsDto {
  isActive?: boolean;
  userId?: string;
  childUserId?: string;
  submitted?: boolean;
  dateReceived?: string;
  notes?: string;
  description?: string;
  amount?: number;
  amountExpected?: number;
  childCoverAmount?: number;
  payTypeId?: string;
  contributionTypeId?: string;
  IncomeTypeId?: string;
  id?: string;
  photoProof?: string;
  insertedDate?: string;
  isOffline?: boolean;
}
