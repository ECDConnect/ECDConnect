import {
  EventRecordType,
  VisitBackReferral,
  VisitDataStatus,
} from '@ecdlink/graphql';
import { MotherDto, VisitDto } from '@ecdlink/core';

export interface MotherState {
  mothers?: MotherDto[];
  mothersWeeklyVisits?: MotherDto[];
  visits?: VisitDto[];
  motherCountForMonth?: number;
  eventRecordTypes?: EventRecordType[];
  referralsForMother?: VisitDataStatus[];
  completedReferralsForMother?: VisitDataStatus[];
}
