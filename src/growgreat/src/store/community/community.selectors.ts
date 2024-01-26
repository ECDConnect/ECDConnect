import { Connect, ConnectItem } from '@ecdlink/graphql';
import { RootState } from '../types';

export const getConnectData = (state: RootState): Connect[] | undefined =>
  state.community.connect;

export const getConnectItems = (
  state: RootState
): ConnectItem[] | undefined => {
  return state.community?.connectItem?.filter((item) => item?.link !== '');
};
