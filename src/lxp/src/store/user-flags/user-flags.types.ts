import { UserFlagDto } from '@ecdlink/core';
import { OfflineUpdate } from '@/models/sync/offline-update';

export interface UserFlagsState {
  /**
   * Flags known for the signed-in user. An entry with `synced: false` was set
   * on this device and has not reached the server yet; the offline sync queue
   * pushes those.
   */
  flags: (UserFlagDto & OfflineUpdate)[];
}
