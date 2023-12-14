import { Connect, ConnectItem } from '@ecdlink/graphql';
import { RootState } from '../types';

export const getConnectData = (state: RootState): Connect[] | undefined =>
  state.community.connect;

export const GetConnectItems = (state: RootState): ConnectItem[] | undefined =>
  state.community.connectItem;
