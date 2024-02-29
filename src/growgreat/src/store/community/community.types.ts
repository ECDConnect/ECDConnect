import { Connect, ConnectItem, MoreInformation } from '@ecdlink/graphql';

export interface CommunityState {
  connect?: Connect[];
  connectItem?: ConnectItem[];
  team?: {
    info?: {
      [key: string]: {
        dateLoaded: string;
        data: MoreInformation[];
      };
    }[];
  };
}
