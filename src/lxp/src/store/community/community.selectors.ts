import { CommunitySectionSs, CommunitySectionItemSs } from '@ecdlink/graphql';
import { RootState } from '../types';

export const getCommunityConnectDataForSSSelector = (
  state: RootState
): CommunitySectionSs[] | undefined => state.community.connectSectionData;

export const GetCommunitySectionItemsSSSelector = (
  state: RootState
): CommunitySectionItemSs[] | undefined =>
  state.community.connectSectionItemData;
