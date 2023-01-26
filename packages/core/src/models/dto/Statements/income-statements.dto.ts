export interface IncomeStatementsDto {
  IsActive: boolean;
  UserId: string;
  ChildUserId: string;
  Submitted: boolean;
  DateReceived: string;
  Notes: string;
  Description?: string;
  Amount: number;
  AmountExpected: number;
  ChildCoverAmount: number;
  PayTypeId: string;
  ContributionTypeId: string;
  IncomeTypeId: string;
}
