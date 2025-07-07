import {
  CalendarEventActionModel,
  CalendarEventModel,
  ChildDto,
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
    title: `${practitioner.user?.firstName} ${
      practitioner.user?.surname || ''
    }`,
    subTitle: practitioner.isPrincipal ? 'Principal' : 'Practitioner',
    profileText: `${
      practitioner.user?.firstName && practitioner.user?.firstName[0]
    }${
      (practitioner.user?.surname || '') &&
      practitioner.user?.surname &&
      practitioner.user?.surname[0]
    }`,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor() || '',
    extraData: {
      userId: practitioner.user?.id || '',
      firstName: practitioner.user?.firstName || '',
      surname: practitioner.user?.surname || '',
      userRole: practitioner.isPrincipal ? 'Principal' : 'Practitioner',
      profileImage: practitioner.user?.profileImageUrl!,
    },
    rightIcon: '',
  };
};

export const mapChildToListDataItem = (child: ChildDto): ListDataItem => {
  return {
    id: child.userId || '',
    profileDataUrl: child.user?.profileImageUrl,
    title: `${child.user?.firstName} ${child.user?.surname}`,
    subTitle: 'Child',
    profileText: `${child.user?.firstName && child.user?.firstName[0]}${
      child.user?.surname && child.user?.surname[0]
    }`,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor() || '',
    extraData: {
      userId: child.user?.id || '',
      firstName: child.user?.firstName || '',
      surname: child.user?.surname || '',
      userRole: 'Child',
      profileImage: child.user?.profileImageUrl!,
    },
    rightIcon: '',
  };
};

export const mapCurrentUserToListDataItem = (user: UserDto): ListDataItem => {
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
      userRole: 'You',
      profileImage: user.profileImageUrl!,
    },
    rightIcon: '',
    noClick: true,
  };
};

export const mapUserToListDataItem = (
  firstName: string,
  surname: string,
  userId: string,
  profileImageUrl: string,
  roleName: string
): ListDataItem => {
  return {
    id: userId || '',
    profileDataUrl: profileImageUrl,
    title: `${firstName} ${surname}`,
    subTitle: roleName,
    profileText: `${firstName && firstName[0]}${surname && surname[0]}`,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor() || '',
    extraData: {
      userId: userId,
      firstName: firstName + '' + surname || '',
      surname: '',
      userRole: roleName,
      profileImage: profileImageUrl,
    },
    rightIcon: '',
  };
};

export const sortListDataItems = (items: ListDataItem[]) => {
  items.sort((a, b) => {
    if (a.extraData?.userRole === 'Child' && b.extraData?.userRole === 'Child')
      return -1;
    if (a.extraData?.userRole === b.extraData?.userRole) {
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
