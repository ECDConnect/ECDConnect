import { EntityBase } from '../entity-base';
import { UserDto } from './user.dto';

export interface CoachDto extends EntityBase {
  user?: UserDto;
  userId?: string;
  areaOfOperation: string;
  secondaryAreaOfOperation: string;
  startDate?: Date;
}
