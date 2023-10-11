import {
  ExpenseItemDto,
  IncomeItemDto,
  IncomeStatementDto,
  PractitionerDto,
} from '@ecdlink/core';
import { PointsUserSummary } from '@ecdlink/graphql';

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
      unsubmittedIncomeItems: IncomeItemDto[];
      unsubmittedExpenseItems: ExpenseItemDto[];
    };
  };
}
