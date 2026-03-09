import { CommunityUserDto, UserDto } from '@ecdlink/core';

export const userGreetingName = (
  userObj: UserDto,
  greeting: string
): string => {
  if (userObj && userObj?.firstName) {
    return `${greeting} ${userObj?.firstName}`;
  }
  return greeting;
};

export const communityUserGreetingName = (
  userObj: CommunityUserDto,
  greeting: string
): string => {
  if (userObj && userObj?.fullName) {
    return `${greeting} ${userObj?.fullName}`;
  }

  return greeting;
};
