import { EntityBase } from '../entity-base';

export interface SettingsDto extends EntityBase {
  grouping: string;
  name: string;
  value: string;
  isSystemValue?: boolean;
  fullPath?: string;
}
