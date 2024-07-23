import { IncomeStatementDto, PractitionerDto } from '@ecdlink/core';
import {
  ChildProgressReportsStatus,
  PointsUserSummary,
} from '@ecdlink/graphql';

export interface PractitionerForCoachState {
  practitionerForCoach?: PractitionerDto;
  practitionersForCoach?: PractitionerDto[];
  pointsForPractitionerUser: {
    [userId: string]: {
      dateLoaded: string;
      pointsSummaries: PointsUserSummary[];
    };
  };
  statementsForPractitionerUser: {
    [userId: string]: {
      statementsDateLoaded: string;
      incomeDateLoaded: string;
      expensesDateLoaded: string;
      statements: IncomeStatementDto[];
    };
  };
  childProgressReportStatusForPractitionerUser: {
    [userId: string]: ChildProgressReportsStatus;
  };
}
