import { CommunityProfileDto } from '@ecdlink/core';

export interface ConnectionProfileRouteState {
  connectionProfile: CommunityProfileDto;
  isFromReceivedConnections?: boolean;
  isFromDashboard?: boolean;
  isConnectedScreen?: boolean;
}
