import { CommunitySectionGg, CommunitySectionItemGg } from '@ecdlink/graphql';
import { RootState } from '../types';

export const getCommunityConnectDataForGGSelector = (
  state: RootState
): CommunitySectionGg[] | undefined => state.community.connectSectionData;

export const GetCommunitySectionItemsGGSelector = (
  state: RootState
): CommunitySectionItemGg[] | undefined =>
  state.community.connectSectionItemData;
