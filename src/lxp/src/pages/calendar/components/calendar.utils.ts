import {
  CalendarEventActionModel,
  CalendarEventModel,
  ClubDto,
  PractitionerDto,
  UserDto,
  getAvatarColor,
} from '@ecdlink/core';
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
      userId: practitioner.user?.id || '',
      firstName: practitioner.user?.firstName || '',
      surname: practitioner.user?.surname || '',
      isClub: false,
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
      userId: user.id || '',
      firstName: user.firstName || '',
      surname: user.surname || '',
      isClub: false,
    },
    rightIcon: '',
    noClick: true,
  };
};

export const mapClubToListDataItem = (club: ClubDto): ListDataItem => {
  return {
    id: club.id,
    title: club.name,
    subTitle: 'Club',
    profileText: club.name,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor() || '',
    extraData: {
      userId: '',
      firstName: club.name,
      surname: '',
      isClub: true,
    },
    rightIcon: '',
  };
};

export const sortListDataItems = (items: ListDataItem[]) => {
  items.sort((a, b) => {
    if (a.extraData?.isClub === true && b.extraData?.isClub === false)
      return -1;
    if (a.extraData?.isClub === b.extraData?.isClub) {
      if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
    }
    return 1;
  });
};

export const getEventAction = (
  event: CalendarEventModel
): CalendarEventActionModel | null => {
  if (!!event.action) return event.action;

  if (
    !!event.eventType &&
    event.eventType.toLowerCase() === 'coaching circle'
  ) {
    return {
      buttonName: `Start ${event.eventType.toLowerCase()}`,
      url: '/community',
      state: {
        activeTabIndex: 2,
        isFromDashboard: false,
        addCoachCircle: true,
        eventDate: event.start,
      },
    } as CalendarEventActionModel;
  }

  return null;
};
