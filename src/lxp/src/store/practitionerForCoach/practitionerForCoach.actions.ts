import { IncomeStatementDto, PractitionerDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PractitionerService } from '@services/PractitionerService';
import { RootState, ThunkApiType } from '../types';
import { differenceInDays } from 'date-fns';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import { ChildProgressReportsStatus } from '@ecdlink/graphql';
import { CoachService } from '@/services/CoachService';
import { ClassroomGroupDto as SimpleClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { OverrideCache } from '@/models/sync/override-cache';

export const PractitionersForCoachActions = {
  GET_CHILD_PROGRESS_REPORTS_STATUS: 'getChildProgressReportsStatus',
  UPDATE_USER_CONTACT_STATUS_FOR_STATEMENT:
    'updateUserContactStatusForStatement',
};

export const getPractitionersForCoach = createAsyncThunk<
  PractitionerDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getPractitionersForCoach',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      practitionerForCoach: {
        practitionersForCoach: practitionersForCoachCache,
      },
    } = getState();

    if (!practitionersForCoachCache) {
      try {
        let practitionersForCoach: PractitionerDto[] | undefined;

        if (userAuth?.auth_token) {
          practitionersForCoach = await new PractitionerService(
            userAuth?.auth_token
          ).getPractitionersForCoach(userAuth?.id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        return practitionersForCoach;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return practitionersForCoachCache;
    }
  }
);

export const getPractitionerById = createAsyncThunk<
  PractitionerDto,
  { id: string },
  ThunkApiType<RootState>
>(
  'getPractitionerById',
  // eslint-disable-next-line no-empty-pattern
  async ({ id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      practitioner: { practitioner: practitionerCache },
    } = getState();

    if (!practitionerCache) {
      try {
        let practitioner: PractitionerDto | undefined;

        if (userAuth?.auth_token) {
          practitioner = await new PractitionerService(
            userAuth?.auth_token
          ).getPractitionerById(id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!practitioner) {
          return rejectWithValue('Error getting practitioner');
        }

        return practitioner;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return practitionerCache;
    }
  }
);

export const getUserStatementsForCoach = createAsyncThunk<
  IncomeStatementDto[],
  { userId: string; startDate: Date; endDate?: Date },
  ThunkApiType<RootState>
>(
  'getUserStatementsForCoach',
  async ({ userId, startDate, endDate }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      practitionerForCoach: { statementsForPractitionerUser: statementCache },
    } = getState();

    try {
      let statements: IncomeStatementDto[] | undefined;

      // Basic caching
      if (!!statementCache[userId]) {
        const daysSinceLoad = differenceInDays(
          new Date(),
          new Date(statementCache[userId].statementsDateLoaded)
        );

        if (daysSinceLoad < 1) {
          return statementCache[userId].statements;
        }
      }

      if (userAuth?.auth_token) {
        statements = await new IncomeStatementsService(
          userAuth?.auth_token
        ).getIncomeStatements(userId, startDate, endDate);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return statements;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUserContactStatusForStatement = createAsyncThunk<
  IncomeStatementDto,
  { statementId: string },
  ThunkApiType<RootState>
>(
  PractitionersForCoachActions.UPDATE_USER_CONTACT_STATUS_FOR_STATEMENT,
  async ({ statementId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      if (userAuth?.auth_token) {
        const response = await new IncomeStatementsService(
          userAuth?.auth_token
        ).updateUserContactStatusForStatement(statementId);

        return response;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// export const getUserIncomeForCoach = createAsyncThunk<
//   IncomeItemDto[],
//   { userId: string },
//   ThunkApiType<RootState>
// >(
//   'getUserIncomeForCoach',
//   async ({ userId }, { getState, rejectWithValue }) => {
//     const {
//       auth: { userAuth },
//       practitionerForCoach: { statementsForPractitionerUser: statementCache },
//     } = getState();

//     try {
//       let incomeItems: IncomeItemDto[] | undefined;

//       // Basic caching
//       if (!!statementCache[userId]) {
//         const daysSinceLoad = differenceInDays(
//           new Date(),
//           new Date(statementCache[userId].incomeDateLoaded)
//         );

//         if (daysSinceLoad < 1) {
//           return statementCache[userId].unsubmittedIncomeItems;
//         }
//       }

//       if (userAuth?.auth_token) {
//         incomeItems = await new IncomeStatementsService(
//           userAuth?.auth_token
//         ).getUnsubmittedIncomeItems(userId);
//       } else {
//         return rejectWithValue('no access token, profile check required');
//       }

//       return incomeItems;
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );

// export const getUserExpensesForCoach = createAsyncThunk<
//   ExpenseItemDto[],
//   { userId: string },
//   ThunkApiType<RootState>
// >(
//   'getUserExpensesForCoach',
//   async ({ userId }, { getState, rejectWithValue }) => {
//     const {
//       auth: { userAuth },
//       practitionerForCoach: { statementsForPractitionerUser: statementCache },
//     } = getState();

//     try {
//       let expenseItems: ExpenseItemDto[] | undefined;

//       // Basic caching
//       if (!!statementCache[userId]) {
//         const daysSinceLoad = differenceInDays(
//           new Date(),
//           new Date(statementCache[userId].expensesDateLoaded)
//         );

//         if (daysSinceLoad < 1) {
//           return statementCache[userId].unsubmittedExpenseItems;
//         }
//       }

//       if (userAuth?.auth_token) {
//         expenseItems = await new IncomeStatementsService(
//           userAuth?.auth_token
//         ).getUnsubmittedExpenseItems(userId);
//       } else {
//         return rejectWithValue('no access token, profile check required');
//       }

//       return expenseItems;
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );

export const getChildProgressReportsStatusForUser = createAsyncThunk<
  ChildProgressReportsStatus,
  { userId: string },
  ThunkApiType<RootState>
>(
  'getChildProgressReportsStatus',
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let reportsStatus: ChildProgressReportsStatus | undefined;

      if (userAuth?.auth_token) {
        reportsStatus = await new CoachService(
          userAuth?.auth_token!
        ).getChildProgressReportsStatusForUser(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return reportsStatus;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
