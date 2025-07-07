import { EntityCacheBase } from './entity-cache-base';

export interface ClassroomGroup extends EntityCacheBase {
  id?: number;
  classroomId: number;
  programmeTypeId?: number;
  name: string;
}
