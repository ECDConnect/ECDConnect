import { EntityCacheBase } from './entity-cache-base';

export interface Child extends EntityCacheBase {
  id?: number;
  userId?: string;
  caregiverId?: number;
  cacheCaregiverId?: string;
  languageId?: number;
  allergies?: string;
  disabilities?: string;
  otherHealthConditions?: string;
  childStatusId?: number;
  insertedDate?: string;
}
