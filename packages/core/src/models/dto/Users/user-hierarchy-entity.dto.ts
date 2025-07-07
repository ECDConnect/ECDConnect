import { UserDto } from '.';

export interface UserHierarchyEntityDto {
  id: string;
  user: UserDto;
  userId: string;
  userType: string;
}
