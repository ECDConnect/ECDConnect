import { EntityBase } from '../entity-base';
import { PermissionDto } from './permission.dto';

export interface RoleDto extends EntityBase {
  name: string;
  normalizedName: string;
  permissions: PermissionDto[];
  systemName: string;
}
