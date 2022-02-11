import { EntityCacheBase } from './entity-cache-base';

export interface ClassProgramme extends EntityCacheBase {
  id?: number;
  programmeStartDate: string;
  meetingDay: number;
  isFullDay: boolean;
}
