import { PractitionerDto, UserDto, getAvatarColor } from '@ecdlink/core';
import { ListDataItem } from './calendar.types';

export const mapPractitionerToListDataItem = (
  practitioner: PractitionerDto
): ListDataItem => {
  return {
    id: practitioner.userId || '',
    profileDataUrl: practitioner.user?.profileImageUrl,
    title: `${practitioner.user?.firstName} ${practitioner.user?.surname}`,
    subTitle: practitioner.isTrainee ? 'Trainee' : 'Practitioner',
    profileText: `${
      practitioner.user?.firstName && practitioner.user?.firstName[0]
    }${practitioner.user?.surname && practitioner.user?.surname[0]}`,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor() || '',
    extraData: {
      firstName: practitioner.user?.firstName || '',
      surname: practitioner.user?.surname || '',
    },
    rightIcon: '',
  };
};

export const mapUserToListDataItem = (user: UserDto): ListDataItem => {
  return {
    id: user.id,
    profileDataUrl: user.profileImageUrl,
    title: `${user.firstName} ${user.surname}`,
    subTitle: 'You',
    profileText: `${user.firstName && user.firstName[0]}${
      user.surname && user.surname[0]
    }`,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor() || '',
    extraData: {
      firstName: user.firstName || '',
      surname: user.surname || '',
    },
    rightIcon: '',
    noClick: true,
  };
};

export const sortListDataItems = (items: ListDataItem[]) => {
  items.sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
    return 1;
  });
};
