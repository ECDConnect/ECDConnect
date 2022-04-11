import { EntityCacheBase } from './entity-cache-base';

export interface Note extends EntityCacheBase {
  id: number;
  name: string;
  bodyText: string;
  noteTypeId: number;
  createdUserId: string;
  insertedDate: string;
}
