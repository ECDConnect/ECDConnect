import { EntityBase } from '../entity-base';
import { PermissionDto } from '../Roles';

export interface NavigationDto extends EntityBase {
  sequence: number;
  name: string;
  icon: string;
  route: string;
  description: string;
  permissions: PermissionDto[];
}
