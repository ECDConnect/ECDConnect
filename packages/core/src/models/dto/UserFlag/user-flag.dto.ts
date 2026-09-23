import { EntityBase } from '../entity-base';

/**
 * A one-off milestone recorded against a user on the server: a walkthrough
 * they finished, a prompt they dismissed.
 *
 * These used to live in browser localStorage, where they were lost on a cache
 * clear or a new device and were shared by everyone using the same phone.
 */
export interface UserFlagDto extends EntityBase {
  flagKey: string;
  /** Optional payload; a flag that exists is set, so this is usually absent. */
  flagValue?: string | null;
}
