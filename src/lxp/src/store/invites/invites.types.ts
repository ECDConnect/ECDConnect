import { InviteDto } from '@ecdlink/core';
import { OfflineUpdate } from '@/models/sync/offline-update';

export interface InvitesState {
  invites?: (InviteDto & OfflineUpdate)[] | undefined;
}
