import { CommunityProfileDto } from '@ecdlink/core';
import { CommunityProfile, Connect, ConnectItem } from '@ecdlink/graphql';

export interface CommunityState {
  connect?: Connect[];
  connectItem?: ConnectItem[];
  communityProfile?: CommunityProfileDto | undefined;
}
