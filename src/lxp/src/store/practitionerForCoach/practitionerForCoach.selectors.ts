import { PointsSummaryDto, PractitionerDto } from '@ecdlink/core';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';

export const getPractitionerForCoach = (
  state: RootState
): PractitionerDto | undefined =>
  state.practitionerForCoach.practitionerForCoach;

export const getPractitionersForCoach = (
  state: RootState
): PractitionerDto[] | undefined =>
  state.practitionerForCoach.practitionersForCoach;

export const getStatementsForUser = (userId: string) =>
  createSelector(
    (state: RootState) =>
      state.practitionerForCoach.statementsForPractitionerUser,
    (statements) => {
      return [...(statements[userId]?.statements || [])].sort(
        (a, b) => a.year - b.year || a.month - b.month
      );
    }
  );

export const getUserStatementById = (userId: string, statementId: string) =>
  createSelector(
    (state: RootState) =>
      state.practitionerForCoach.statementsForPractitionerUser,
    (statements) => {
      return statements[userId]?.statements.find((x) => x.id === statementId);
    }
  );

export const getPointsSummaryWithLibraryForPractitioner = (
  userId: string,
  date: Date
) =>
  createSelector(
    (state: RootState) => state.practitionerForCoach.pointsForPractitionerUser,
    (state: RootState) => state.points.pointsLibrary,
    (state: RootState) => state.practitionerForCoach.practitionersForCoach,
    (pointsSummariesForUsers, pointsLibrary, practitionersForCoach) => {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const practitioner = practitionersForCoach?.find(
        (x) => x.userId === userId
      );

      if (!practitioner) {
        return [];
      }

      const usersPointsSummaries =
        pointsSummariesForUsers[userId].pointsSummaries;

      const pointsSummaries: PointsSummaryDto[] = pointsLibrary?.map(
        (pointsLibrary) => {
          // Get the points summary for the user for
          const pointsSummaryForMonth = usersPointsSummaries?.find(
            (x) =>
              x.month === month &&
              x.year === year &&
              x.pointsLibrary?.id === pointsLibrary.id
          );

          // Get the max pointsYTD from all the summaries for the year, this will be out total for the year
          const pointsForYear = Math.max(
            ...usersPointsSummaries
              ?.filter(
                (x) =>
                  x.year === year && x.pointsLibrary?.id === pointsLibrary.id
              )
              ?.map((x) => x.pointsYTD)
          );

          return {
            pointsLibraryId: pointsLibrary.id,
            month: month,
            year: year,

            pointsTotal: pointsSummaryForMonth?.pointsTotal || 0,
            pointsYTD: pointsForYear, // TODO need to fix this to get the max
            timesScored: pointsSummaryForMonth?.timesScored || 0,

            activity: pointsLibrary.activity || '',
            subActivity: pointsLibrary.subActivity || '',
            description: pointsLibrary.description || '',
            todoDescription: pointsLibrary.todoDescription || '',
            maxMonthlyPoints: practitioner?.isPrincipal
              ? pointsLibrary.maxPointsPrincipalMonthly
              : pointsLibrary.maxPointsNonPrincipalMonthly,
            maxYearlyPoints: practitioner?.isPrincipal
              ? pointsLibrary.maxPointsPrincipalYearly
              : pointsLibrary.maxPointsNonPrincipalYearly,
            pointsPerAward: pointsLibrary.points,
          };
        }
      );

      return pointsSummaries;
    }
  );

export const getPointsTotalForYear = (userId: string) =>
  createSelector(
    (state: RootState) => state.practitionerForCoach.pointsForPractitionerUser,
    (state: RootState) => state.points.pointsLibrary,
    (state: RootState) => state.practitioner.practitioners,
    (pointsSummariesForUsers, pointsLibrary, practitioners) => {
      let total = 0;
      const currentYear = new Date().getFullYear();

      const practitioner = practitioners?.find((x) => x.userId === userId);

      if (!practitioner) {
        return 0;
      }

      const usersPointsSummaries =
        pointsSummariesForUsers[userId].pointsSummaries;

      pointsLibrary?.forEach((activity) => {
        const summariesForActivity = usersPointsSummaries
          .filter(
            (x) => x.year === currentYear && x.pointsLibrary?.id === activity.id
          )
          .map((x) => x.pointsYTD);

        let pointsForYear = 0;
        if (!!summariesForActivity && !!summariesForActivity.length) {
          pointsForYear = Math.max(...summariesForActivity);
        }

        total += pointsForYear;
      });

      return total;
    }
  );

export const getChildProgressReportsStatusForUser = (userId: string) =>
  createSelector(
    (state: RootState) =>
      state.practitionerForCoach.childProgressReportStatusForPractitionerUser[
        userId
      ],
    (reportsStatus) => reportsStatus
  );
