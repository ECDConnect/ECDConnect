import { HealthCareWorkerDto, UserPointsAcitivtyDto } from '@ecdlink/core';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';

export const getHealthCareWorker = (
  state: RootState
): HealthCareWorkerDto | undefined => state.healthCareWorker.healthCareWorker;

export const getHealthCareWorkerPointsDetailsSelector = (state: RootState) =>
  state.healthCareWorker.points.data;

export const getHealthCareWorkerTotalPointsSelector = (state: RootState) => {
  const points = state.healthCareWorker.points.data;
  return points?.reduce((acc, curr) => acc + curr.pointsTotal, 0);
};

export const getHealthCareWorkerPointsDetailsPerMonthSelector = () =>
  createSelector(getHealthCareWorkerPointsDetailsSelector, (points) => {
    const dividedByMonth: { [key: number]: UserPointsAcitivtyDto[] } = {};

    points?.forEach((item) => {
      const { month } = item;
      if (!dividedByMonth[month]) {
        dividedByMonth[month] = [];
      }
      dividedByMonth[month].push(item);
    });

    return Object.values(dividedByMonth)?.reverse();
  });

export const getHealthCareWorkerTotalPointsPerMonthSelector = (month: number) =>
  createSelector(getHealthCareWorkerPointsDetailsSelector, (points) => {
    const filteredPoints = points?.filter((point) => point.month === month);
    return filteredPoints?.reduce((acc, curr) => acc + curr.pointsTotal, 0);
  });

export const getMoreInformationSelector = (locale: string) =>
  createSelector(
    (state: RootState) => state.healthCareWorker.points.infoPage,
    (info) => info?.find((item) => item[locale])?.[locale]?.data?.[0]
  );
