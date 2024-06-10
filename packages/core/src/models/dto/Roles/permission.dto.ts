import { EntityBase } from '../entity-base';

export interface PermissionDto extends EntityBase {
  name: string;
  normalizedName: string;
  grouping: string;
  id: string;
}

export interface PermissionGroupDto {
  groupName: string;
  permissions: PermissionDto[];
}
