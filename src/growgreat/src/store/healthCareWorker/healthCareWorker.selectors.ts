import { HealthCareWorkerDto, UserPointsAcitivtyDto } from '@ecdlink/core';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';

export const getHealthCareWorker = (
  state: RootState
): HealthCareWorkerDto | undefined => state.healthCareWorker.healthCareWorker;

export const getHealthCareWorkerCompletedPointsDetailsSelector = (
  state: RootState
) => state.healthCareWorker.points.completedItems;

export const getHealthCareWorkerTotalCompletedPointsSelector = (
  state: RootState
) => {
  const points = state.healthCareWorker.points.completedItems;
  return points?.reduce((acc, curr) => acc + curr.pointsTotal, 0) ?? 0;
};

export const getHealthCareWorkerAllCompletedPointsDetailsSplitPerMonthSelector =
  () =>
    createSelector(
      getHealthCareWorkerCompletedPointsDetailsSelector,
      (points) => {
        const dividedByMonth: { [key: number]: UserPointsAcitivtyDto[] } = {};

        points?.forEach((item) => {
          const { month } = item;
          if (!dividedByMonth[month]) {
            dividedByMonth[month] = [];
          }
          dividedByMonth[month].push(item);
        });

        return Object.values(dividedByMonth)?.reverse();
      }
    );

export const getHealthCareWorkerCompletedPointsByMonthSelector = (
  month: number
) =>
  createSelector(
    getHealthCareWorkerCompletedPointsDetailsSelector,
    (points) => {
      return points?.filter((point) => point.month === month);
    }
  );

export const getHealthCareWorkerTotalCompletedPointsByMonthSelector = (
  month: number
) =>
  createSelector(
    getHealthCareWorkerCompletedPointsDetailsSelector,
    (points) => {
      const filteredPoints = points?.filter((point) => point.month === month);
      return (
        filteredPoints?.reduce((acc, curr) => acc + curr.pointsTotal, 0) ?? 0
      );
    }
  );

export const getMoreInformationSelector = (locale: string) =>
  createSelector(
    (state: RootState) => state.healthCareWorker.points.infoPage,
    (info) => info?.find((item) => item[locale])?.[locale]?.data?.[0]
  );

export const getHealthCareWorkerTeamStandingSelector = (state: RootState) =>
  state.healthCareWorker.teamStanding;

export const getHealthCareWorkerPointsTodoItemsSelector = (state: RootState) =>
  state.healthCareWorker.points.todoItems;
