import { createSelector } from 'reselect';
import { RootState } from '../types';
import { PointsLibrary, PointsUserSummary } from '@ecdlink/graphql';
import { PointsSummaryDto, PractitionerDto } from '@ecdlink/core';

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

            activity: pointsLibrary.activity || '',
            subActivity: pointsLibrary.subActivity || '',
            description: pointsLibrary.description || '',
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
      const currentDate = new Date();
      const activity = pointsLibrary.find((x) => x.id === id);
      const pointsSummaries: PointsSummaryDto[] = [];

      if (!activity) {
        return [];
      }

      for (let i = 0; i < 12; i++) {
        currentDate.setMonth(currentDate.getMonth() - i);
        const month = currentDate.getMonth();
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

          activity: activity.activity || '',
          subActivity: activity.subActivity || '',
          description: activity.description || '',
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
      }

      return pointsSummaries;
    }
  );
