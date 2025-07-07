import { CommunityProfile, Connect, ConnectItem } from '@ecdlink/graphql';
import { RootState } from '../types';
import { CommunityProfileDto } from '@ecdlink/core';

export const getConnectData = (state: RootState): Connect[] | undefined =>
  state.community.connect;

export const GetConnectItems = (state: RootState): ConnectItem[] | undefined =>
  state.community.connectItem;

export const getConnectItems = (
  state: RootState
): ConnectItem[] | undefined => {
  return state.community?.connectItem?.filter((item) => item?.link !== '');
};

export const getCommunityProfile = (
  state: RootState
): CommunityProfileDto | undefined => {
  return state.community?.communityProfile;
};
