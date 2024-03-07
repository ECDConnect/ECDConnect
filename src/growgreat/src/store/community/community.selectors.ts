import { Connect, ConnectItem } from '@ecdlink/graphql';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';

export const getConnectData = (state: RootState): Connect[] | undefined =>
  state.community.connect;

export const getConnectItems = (
  state: RootState
): ConnectItem[] | undefined => {
  return state.community?.connectItem?.filter((item) => item?.link !== '');
};

export const getMoreInformationSelector = (locale: string) =>
  createSelector(
    (state: RootState) => state.community?.team?.earnPointsInfo,
    (info) => info?.find((item) => item[locale])?.[locale]?.data?.[0]
  );

export const getPointsActivityInfoSelector = (
  activitySlug: string,
  locale: string
) =>
  createSelector(
    (state: RootState) => state.community?.team?.activityInfo,
    (info) =>
      info?.find((item) => item[activitySlug])?.[activitySlug]?.[locale]
        ?.data?.[0]
  );

export const getClinicSelector = (state: RootState) =>
  state.community?.team?.clinic?.data;

export const getLeagueSelector = (state: RootState) =>
  state.community?.league?.data;

export const getBreastFeedingClubsSelector = (state: RootState) =>
  state.community?.breastFeedingClubs?.data;
