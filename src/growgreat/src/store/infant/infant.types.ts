import { InfantDto } from '@ecdlink/core';

export interface InfantState {
  infants?: InfantDto[];
  infantsWeeklyVisits?: InfantDto[];
  infantCountForMonth?: number;
}
