import { EntityCacheBase } from './entity-cache-base';
import { SiteAddress } from './site-address';

export interface Classroom extends EntityCacheBase {
  id: number;
  userId: string;
  siteAddressId?: number;
  siteAddress?: SiteAddress;
  name: string;
  classroomImageUrl?: string;
  insertedDate: string;
}
