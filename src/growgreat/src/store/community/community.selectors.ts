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
    (state: RootState) => state.community?.team?.info,
    (info) => info?.find((item) => item[locale])?.[locale]?.data
  );
