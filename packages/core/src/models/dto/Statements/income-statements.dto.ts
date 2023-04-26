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
export interface ReportTableDataDto {
  tableName: string;
  type: string;
  headers: { header: string; dataKey: string }[];
  data: { [key: string]: any }[];
};
