import {
  EventRecordType,
  VisitBackReferral,
  VisitDataStatus,
} from '@ecdlink/graphql';
import { InfantDto, VisitDto } from '@ecdlink/core';

export interface InfantState {
  infants?: InfantDto[];
  infantsWeeklyVisits?: InfantDto[];
  infantCountForMonth?: number;
  visits?: VisitDto[];
  eventRecordTypes?: EventRecordType[];
  referralsForInfant?: VisitDataStatus[];
  backReferralsForInfant?: VisitBackReferral[];
}
