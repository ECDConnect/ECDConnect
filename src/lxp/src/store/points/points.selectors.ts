import { createSelector } from 'reselect';
import { RootState } from '../types';
import { PointsLibrary, PointsUserSummary } from '@ecdlink/graphql';
import {
  PointsSummaryDto,
  PractitionerDto,
  getPreviousMonth,
} from '@ecdlink/core';

export const getPointsSummary = createSelector(
  (state: RootState) => state.points.pointsSummary,
  (pointsSummary: PointsUserSummary[]) => pointsSummary
);

export const getPointsLibrary = createSelector(
  (state: RootState) => state.points.pointsLibrary,
  (pointsLibrary: PointsLibrary[]) => pointsLibrary
);

export const getPointsSummaryWithLibrary = (date: Date) =>
  createSelector(
    (state: RootState) => state.points.pointsSummary,
    (state: RootState) => state.points.pointsLibrary,
    (state: RootState) => state.practitioner.practitioner,
    (
      pointsSummary: PointsUserSummary[],
      pointsLibrary: PointsLibrary[],
      practitioner: PractitionerDto | undefined
    ) => {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const pointsSummaries: PointsSummaryDto[] = pointsLibrary.map(
        (pointsLibrary) => {
          // Get the points summary for the user for
          const pointsSummaryForMonth = pointsSummary.find(
            (x) =>
              x.month == month &&
              x.year == year &&
              x.pointsLibrary?.id === pointsLibrary.id
          );
          return {
            pointsLibraryId: pointsLibrary.id,
            month: month,
            year: year,

            pointsTotal: pointsSummaryForMonth?.pointsTotal || 0,
            pointsYTD: pointsSummaryForMonth?.pointsYTD || 0,
            timesScored: pointsSummaryForMonth?.timesScored || 0,

            activity: pointsLibrary.activity || '',
            subActivity: pointsLibrary.subActivity || '',
            description: pointsLibrary.description || '',
            todoDescription: pointsLibrary.todoDescription || '',
            maxMonthlyPoints:
              practitioner?.isPrincipal || practitioner?.isFundaAppAdmin
                ? pointsLibrary.maxPointsPrincipalMonthly
                : pointsLibrary.maxPointsNonPrincipalMonthly,
            maxYearlyPoints:
              practitioner?.isPrincipal || practitioner?.isFundaAppAdmin
                ? pointsLibrary.maxPointsPrincipalYearly
                : pointsLibrary.maxPointsNonPrincipalYearly,
            pointsPerAward: pointsLibrary.points,
          };
        }
      );

      return pointsSummaries;
    }
  );

export const getPointsLibraryById = (id: string) =>
  createSelector(
    (state: RootState) => state.points.pointsLibrary,
    (pointsLibrary: PointsLibrary[]) => {
      return pointsLibrary.find((x) => x.id === id);
    }
  );

// Returns the last 12 months of summaries for a specific activity
export const getPointsSummariesForActivity = (id: string) =>
  createSelector(
    (state: RootState) => state.points.pointsSummary,
    (state: RootState) => state.points.pointsLibrary,
    (state: RootState) => state.practitioner.practitioner,
    (
      pointsSummary: PointsUserSummary[],
      pointsLibrary: PointsLibrary[],
      practitioner: PractitionerDto | undefined
    ) => {
      const activity = pointsLibrary.find((x) => x.id === id);
      const pointsSummaries: PointsSummaryDto[] = [];

      if (!activity) {
        return [];
      }

      let currentDate = new Date();
      for (let i = 0; i < 12; i++) {
        const month = currentDate.getMonth() + 1; // 0 indexing
        const year = currentDate.getFullYear();

        const pointsSummaryForMonth = pointsSummary.find(
          (x) =>
            x.month == month && x.year == year && x.pointsLibrary?.id === id
        );

        pointsSummaries.push({
          pointsLibraryId: id,
          month: month,
          year: year,

          pointsTotal: pointsSummaryForMonth?.pointsTotal || 0,
          pointsYTD: pointsSummaryForMonth?.pointsYTD || 0,
          timesScored: pointsSummaryForMonth?.timesScored || 0,

          activity: activity.activity || '',
          subActivity: activity.subActivity || '',
          description: activity.description || '',
          todoDescription: activity.todoDescription || '',
          maxMonthlyPoints:
            practitioner?.isPrincipal || practitioner?.isFundaAppAdmin
              ? activity.maxPointsPrincipalMonthly
              : activity.maxPointsNonPrincipalMonthly,
          maxYearlyPoints:
            practitioner?.isPrincipal || practitioner?.isFundaAppAdmin
              ? activity.maxPointsPrincipalYearly
              : activity.maxPointsNonPrincipalYearly,
          pointsPerAward: activity.points,
        });

        currentDate = getPreviousMonth(currentDate);
      }

      return pointsSummaries;
    }
  );

export const getPointsTotalForYear = () =>
  createSelector(
    (state: RootState) => state.points.pointsSummary,
    (pointsSummary: PointsUserSummary[]) => {
      return pointsSummary
        .filter((x) => x.year === new Date().getFullYear())
        .reduce((total, current) => (total += current.pointsTotal), 0);
    }
  );

export const getCurrentPercentileClubStandingForMonth = () =>
  createSelector(
    (state: RootState) => state.points.userClubStanding,
    (userClubStanding) => {
      return !!userClubStanding
        ? userClubStanding.standing.percentileStandingForCurrentMonth
        : 0;
    }
  );

export const getCurrentClubPercentileStandingForYear = () =>
  createSelector(
    (state: RootState) => state.points.userClubStanding,
    (userClubStanding) => {
      return !!userClubStanding
        ? userClubStanding.standing.percentileStandingForCurrentYear
        : 0;
    }
  );
