import {
  CalendarEventActionModel,
  CalendarEventModel,
  ClinicDto,
  ClinicMemberDto,
  //ClubDto,
  MotherDto,
  TeamLeadDto,
  UserDto,
  getAvatarColor,
} from '@ecdlink/core';
import { ListDataItem } from './calendar.types';
import Pregnant from '@/assets/pregnant.svg';

export const mapMotherToListDataItem = (mother: MotherDto): ListDataItem => {
  return {
    id: mother.user?.id || mother.id || '',
    icon: Pregnant,
    //profileDataUrl: mother.user?.profileImageUrl,
    title: `${mother.user?.firstName} ${mother.user?.surname}`,
    subTitle: mother.statusInfo?.notes || '',
    profileText: `${mother.user?.firstName && mother.user?.firstName[0]}${
      mother.user?.surname && mother.user?.surname[0]
    }`,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor('growgreat') || '',
    extraData: {
      firstName: mother.user?.firstName || '',
      surname: mother.user?.surname || '',
      type: 'mother',
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
    avatarColor: getAvatarColor('growgreat') || '',
    extraData: {
      firstName: user.firstName || '',
      surname: user.surname || '',
      type: 'healthCareWorker',
    },
    rightIcon: '',
    noClick: true,
  };
};

export const mapClinicToListDataItem = (clinic: ClinicDto): ListDataItem => {
  return {
    id: clinic.id,
    title: clinic.name,
    subTitle: 'Clinic',
    profileText: clinic.name,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor('growgreat'),
    extraData: {
      firstName: clinic.name,
      surname: '',
      type: 'clinic',
    },
  };
};

export const mapClinicTeamLeadsToListDataItemList = (
  teamLeads: TeamLeadDto[]
): ListDataItem[] => {
  return teamLeads.map((tl) => mapTeamLeadToListDataItem(tl));
};

export const mapTeamLeadToListDataItem = (
  teamLead: TeamLeadDto
): ListDataItem => {
  return {
    id: teamLead.id,
    profileDataUrl: undefined,
    title: `${teamLead.firstName} ${teamLead.surname}`,
    subTitle: 'Team Lead',
    profileText: `${teamLead.firstName && teamLead.firstName[0]}${
      teamLead.surname && teamLead.surname[0]
    }`,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor('growgreat') || '',
    extraData: {
      firstName: teamLead.firstName || '',
      surname: teamLead.surname || '',
      type: 'teamLead',
    },
    rightIcon: '',
    noClick: true,
  };
};

export const mapClinicMembersToListDataItemList = (
  members: ClinicMemberDto[]
): ListDataItem[] => {
  return members.map((m) => mapClinicMemberToListDataItemList(m));
};

export const mapClinicMemberToListDataItemList = (
  member: ClinicMemberDto
): ListDataItem => {
  return {
    id: member.healthCareWorkerId,
    profileDataUrl: member.profileImageUrl,
    title: `${member.firstName} ${member.surname}`,
    subTitle: 'HCW',
    profileText: `${member.firstName && member.firstName[0]}${
      member.surname && member.surname[0]
    }`,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor('growgreat') || '',
    extraData: {
      firstName: member.firstName || '',
      surname: member.surname || '',
      type: 'healthCareWorker',
    },
    rightIcon: '',
    noClick: true,
  };
};

// export const mapClubToListDataItem = (club: ClubDto): ListDataItem => {
//   return {
//     id: club.id,
//     title: club.name,
//     subTitle: 'Club',
//     profileText: club.name,
//     hideAlertSeverity: true,
//     alertSeverity: 'none',
//     avatarColor: getAvatarColor() || '',
//     extraData: {
//       firstName: club.name,
//       surname: '',
//       isClub: true,
//     },
//     rightIcon: '',
//   };
// };

export const sortListDataItems = (items: ListDataItem[]) => {
  items.sort((a, b) => {
    if (a.extraData?.type === 'clinic' && b.extraData?.type !== 'clinic')
      return -1;
    if (a.extraData?.type === b.extraData?.type) {
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
