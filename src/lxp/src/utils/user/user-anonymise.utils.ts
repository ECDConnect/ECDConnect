import { UserDto } from '@ecdlink/core';
import { newGuid } from '../common/uuid.utils';

export const anonymiseUser = (user: UserDto): UserDto => {
  user.isActive = false;
  user.email = '';
  user.firstName = 'Retracted';
  user.surname = 'Retracted';
  user.fullName = 'Retracted';
  user.userName = `Rectracted_${newGuid()}`;
  user.phoneNumber = '';
  user.idNumber = '';

  return user;
};
