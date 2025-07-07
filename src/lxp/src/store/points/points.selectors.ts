import { createSelector } from 'reselect';
import { RootState } from '../types';
import {
  PointsLibrary,
  PointsToDoItemModel,
  PointsUserDateSummary,
  PointsUserSummary,
  PointsUserYearMonthSummary,
} from '@ecdlink/graphql';
import {
  PointsSummaryDto,
  PractitionerDto,
  getPreviousMonth,
} from '@ecdlink/core';
import { getMonth, getYear } from 'date-fns';

export const getPointsSummary = createSelector(
  (state: RootState) => state.points.pointsSummary,
  (pointsSummary: PointsUserSummary[]) => pointsSummary
);

export const getMonthPointsSummary = (state: RootState) => {
  const currentMonth = new Date().getMonth(); // +1 for 0 index
  const currentYear = new Date().getFullYear();
  const pointsSummaryData = state?.points?.pointsSummary;
  const pointsTotal = pointsSummaryData?.reduce((total, current) => {
    const dataMonth = getMonth(new Date(current?.dateScored));
    const dataYear = getYear(new Date(current?.dateScored));

    if (dataMonth === currentMonth && dataYear === currentYear) {
      return (total += current.pointsTotal);
    }
    return total;
  }, 0);
  return pointsTotal;
};

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
      const pointsSummaries: PointsSummaryDto[] = pointsLibrary?.map(
        (pointsLibrary) => {
          // Get the points summary for the user for
          const pointsSummaryForMonth = pointsSummary?.find(
            (x) =>
              x.month === month &&
              x.year === year &&
              x.pointsLibrary?.id === pointsLibrary.id
          );

          // Get the max pointsYTD from all the summaries for the year, this will be out total for the year
          const pointsForYear = Math.max(
            ...pointsSummary
              .filter(
                (x) =>
                  x.year === year && x.pointsLibrary?.id === pointsLibrary.id
              )
              .map((x) => x.pointsYTD)
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

export const getPointsLibraryById = (id: string) =>
  createSelector(
    (state: RootState) => state.points.pointsLibrary,
    (pointsLibrary: PointsLibrary[]) => {
      return pointsLibrary.find((x) => x.id === id);
    }
  );

// Returns the last 12 months of summaries for a specific activity
export const getPointsSummariesForActivity = (
  id: string,
  numberOfMonths: number = 12
) =>
  createSelector(
    (state: RootState) => state.points.pointsSummary,
    (state: RootState) => state.points.pointsLibrary,
    (state: RootState) => state.practitioner.practitioner,
    (
      pointsSummary: PointsUserSummary[],
      pointsLibrary: PointsLibrary[],
      practitioner: PractitionerDto | undefined
    ) => {
      const activity = pointsLibrary?.find((x) => x.id === id);
      const pointsSummaries: PointsSummaryDto[] = [];

      if (!activity) {
        return [];
      }

      let currentDate = new Date();
      for (let i = 0; i < numberOfMonths; i++) {
        const month = currentDate.getMonth() + 1; // 0 indexing
        const year = currentDate.getFullYear();

        const pointsSummaryForMonth = pointsSummary.find(
          (x) =>
            x.month === month && x.year === year && x.pointsLibrary?.id === id
        );

        // Get the max pointsYTD from all the summaries for the year, this will be out total for the year
        const pointsForYear = Math.max(
          ...pointsSummary
            .filter((x) => x.year === year && x.pointsLibrary?.id === id)
            .map((x) => x.pointsYTD)
        );

        pointsSummaries.push({
          pointsLibraryId: id,
          month: month,
          year: year,

          pointsTotal: pointsSummaryForMonth?.pointsTotal || 0,
          pointsYTD: pointsForYear,
          timesScored: pointsSummaryForMonth?.timesScored || 0,

          activity: activity.activity || '',
          subActivity: activity.subActivity || '',
          description: activity.description || '',
          todoDescription: activity.todoDescription || '',
          maxMonthlyPoints: practitioner?.isPrincipal
            ? activity.maxPointsPrincipalMonthly
            : activity.maxPointsNonPrincipalMonthly,
          maxYearlyPoints: practitioner?.isPrincipal
            ? activity.maxPointsPrincipalYearly
            : activity.maxPointsNonPrincipalYearly,
          pointsPerAward: activity.points,
        });

        currentDate = getPreviousMonth(currentDate);
      }

      return pointsSummaries;
    }
  );

export const getPointsSummaryForYear = () =>
  createSelector(
    (state: RootState) => state.points.pointsSummary,
    (state: RootState) => state.points.pointsLibrary,
    (state: RootState) => state.practitioner.practitioner,
    (
      pointsSummary: PointsUserSummary[],
      pointsLibrary: PointsLibrary[],
      practitioner: PractitionerDto | undefined
    ) => {
      const pointsSummaries: PointsSummaryDto[] = [];
      const year = new Date().getFullYear();

      pointsLibrary?.forEach((activity) => {
        const activitySummaries = pointsSummary?.filter(
          (x) => x?.year === year && x?.pointsLibrary?.id === activity.id
        );

        const pointsForYear = Math.max(
          ...activitySummaries.map((x) => x.pointsYTD)
        );

        const timesScored = activitySummaries?.reduce((total, summary) => {
          return (total += summary.timesScored);
        }, 0);

        if (pointsForYear > 0) {
          pointsSummaries.push({
            pointsLibraryId: activity.id,
            month: -1,
            year: year,

            pointsTotal: pointsForYear,
            pointsYTD: pointsForYear,
            timesScored: timesScored,

            activity: activity.activity || '',
            subActivity: activity.subActivity || '',
            description: activity.description || '',
            todoDescription: activity.todoDescription || '',
            maxMonthlyPoints: practitioner?.isPrincipal
              ? activity.maxPointsPrincipalMonthly
              : activity.maxPointsNonPrincipalMonthly,
            maxYearlyPoints: practitioner?.isPrincipal
              ? activity.maxPointsPrincipalYearly
              : activity.maxPointsNonPrincipalYearly,
            pointsPerAward: activity.points,
          });
        }
      });

      return pointsSummaries;
    }
  );

export const getPointsTotalForYear = () =>
  createSelector(
    (state: RootState) => state?.points?.pointsSummary,
    (state: RootState) => state?.points?.pointsLibrary,
    (pointsSummary: PointsUserSummary[], pointsLibrary: PointsLibrary[]) => {
      let total = 0;
      const currentYear = new Date().getFullYear();

      pointsLibrary?.forEach((activity) => {
        const summariesForActivity = pointsSummary
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

export const getPointsToDo = (
  state: RootState
): PointsToDoItemModel | undefined => state.points.pointsToDo;

export const getTotalYearPoints = (state: RootState): number | undefined =>
  state.points.yearPoints?.total;

export const getPointsShareData = (
  state: RootState
): PointsUserDateSummary | undefined => state.points.shareData;
