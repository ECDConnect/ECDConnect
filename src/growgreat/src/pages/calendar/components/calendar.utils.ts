import {
  CalendarEventParticipantModel,
  ClinicDto,
  ClinicMemberDto,
  InfantDto,
  MotherDto,
  TeamLeadDto,
  UserDto,
  getAvatarColor,
} from '@ecdlink/core';
import { ListDataItem, ParticipantType } from './calendar.types';
import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import { newGuid } from '@/utils/common/uuid.utils';

const TypeInfo = {
  clinic: {
    icon: 'UserGroupIcon',
  },
  infant: {
    icon: Infant,
  },
  mother: {
    icon: Pregnant,
  },
  teamLead: {
    icon: undefined,
  },
  healthCareWorker: {
    icon: undefined,
  },
};

const getInfantName = (infant: InfantDto) => {
  const caregiverName = infant.caregiver?.firstName || '';
  const infantName = infant.user?.firstName || '';
  if (!!caregiverName) return `${caregiverName} & ${infantName}`;
  return infantName;
};

export const mapCalendarEventParticipantModelToListDataItem = (
  item: CalendarEventParticipantModel
): ListDataItem => {
  return {
    id: item.participantUserId,
    icon: TypeInfo[item.participantUser.type || 'mother']?.icon,
    title: `${item.participantUser.firstName} ${item.participantUser.surname}`,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor('growgreat') || '',
    extraData: {
      firstName: item.participantUser.firstName,
      surname: item.participantUser.surname,
      type: item.participantUser.type || 'mother',
    },
  };
};

export const mapMotherToListDataItem = (mother: MotherDto): ListDataItem => {
  return {
    id: mother.user?.id || mother.id || '',
    icon: TypeInfo['mother'].icon,
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

export const mapInfantToListDataItem = (infant: InfantDto): ListDataItem => {
  var notes = infant.statusInfo?.notes || '';
  if (notes.length > 0) {
    notes = `${notes[0].toUpperCase()}${notes.slice(1)}`;
  }
  const infantName = getInfantName(infant);
  return {
    id: infant.id || '',
    icon: TypeInfo['infant'].icon,
    //profileDataUrl: mother.user?.profileImageUrl,
    title: infantName,
    subTitle: notes,
    profileText: infantName,
    hideAlertSeverity: true,
    alertSeverity: 'none',
    avatarColor: getAvatarColor('growgreat') || '',
    extraData: {
      firstName: infantName,
      surname: '',
      type: 'infant',
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
    icon: TypeInfo['clinic']?.icon,
    title: clinic.name,
    subTitle: `${clinic.clinicMembers.length} CHW${
      clinic.clinicMembers.length > 1 ? 's' : ''
    }, ${clinic.teamLeads.length} Team Lead${
      clinic.teamLeads.length > 1 ? 's' : ''
    }`,
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
    icon: TypeInfo['teamLead']?.icon,
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
    icon: TypeInfo['healthCareWorker']?.icon,
    profileDataUrl: member.profileImageUrl,
    title: `${member.firstName} ${member.surname}`,
    subTitle: 'CHW',
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
  };
};

const getTypeOrder = (type?: ParticipantType): number => {
  if (type === 'mother') return 1;
  if (type === 'infant') return 2;
  if (type === 'clinic') return 3;
  if (type === 'teamLead') return 4;
  if (type === 'healthCareWorker') return 5;
  return 6;
};

export const sortListDataItems = (items: ListDataItem[]) => {
  items.sort((a, b) => {
    if (a.extraData?.type !== b.extraData?.type)
      return getTypeOrder(a.extraData?.type) - getTypeOrder(b.extraData?.type);
    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
    return 1;
  });
};

export const mapIdsToCalendarEventParticipants = (
  participantUserIds: string[],
  infants?: InfantDto[],
  mothers?: MotherDto[],
  clinicDetails?: ClinicDto
): CalendarEventParticipantModel[] => {
  return participantUserIds
    .map((pid) => {
      const infant = infants?.find((x) => x.id === pid);
      if (!!infant) {
        return {
          id: newGuid(),
          participantUserId: pid,
          participantUser: {
            firstName: getInfantName(infant),
            surname: '',
            type: 'infant',
          },
        };
      }
      const mother = mothers?.find((x) => x.id === pid);
      if (!!mother) {
        return {
          id: newGuid(),
          participantUserId: pid,
          participantUser: {
            firstName: mother.user?.firstName || '',
            surname: mother.user?.surname || '',
            type: 'mother',
          },
        };
      }
      const teamLead = clinicDetails?.teamLeads.find(
        (tl) => tl.user?.id === pid
      );
      if (!!teamLead) {
        return {
          id: newGuid(),
          participantUserId: pid,
          participantUser: {
            firstName: teamLead.firstName || '',
            surname: teamLead.surname || '',
            type: 'teamLead',
          },
        };
      }
      const hcw = clinicDetails?.clinicMembers.find(
        (m) => m.healthCareWorkerId === pid
      );
      if (!!hcw) {
        return {
          id: newGuid(),
          participantUserId: pid,
          participantUser: {
            firstName: hcw.firstName || '',
            surname: hcw.surname || '',
            type: 'healthCareWorker',
          },
        };
      }
      return undefined;
    })
    .filter((x) => x !== undefined) as CalendarEventParticipantModel[];
};
