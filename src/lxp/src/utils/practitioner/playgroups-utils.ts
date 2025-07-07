import { ClassProgrammeDto, ClassroomGroupDto } from '@ecdlink/core';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';
import { newGuid } from '../common/uuid.utils';

export enum Weekdays {
  mon = 1,
  tue = 2,
  wed = 3,
  thu = 4,
  fri = 5,
  sat = 6,
  sun = 7,
}

export const generateEmptyPlaygroups = (
  numberOfPlaygroups: number
): EditPlaygroupModel[] => {
  const playGroups: EditPlaygroupModel[] = [];
  for (let i = 0; i < numberOfPlaygroups; i++) {
    playGroups.push({
      name: '',
      meetingDays: [],
      classroomGroupId: newGuid(),
      meetEveryday: false,
    });
  }
  return playGroups;
};

export const isValidWeekday = (dayValue: number) => {
  return [
    Weekdays.mon,
    Weekdays.tue,
    Weekdays.wed,
    Weekdays.thu,
    Weekdays.fri,
  ].some((singleBwValue) => singleBwValue === dayValue);
};

export const getWeekdayValue = (weekDay: Weekdays): string => {
  switch (weekDay) {
    case Weekdays.mon:
      return 'Monday';
    case Weekdays.tue:
      return 'Tuesday';
    case Weekdays.wed:
      return 'Wednesday';
    case Weekdays.thu:
      return 'Thursday';
    case Weekdays.fri:
      return 'Friday';
    case Weekdays.sat:
      return 'Saturday';
    case Weekdays.sun:
      return 'Sunday';
  }
};

export const canDeleteClassroomGroup = (classroomGroup: ClassroomGroupDto) => {
  if (
    !classroomGroup ||
    !classroomGroup.learners ||
    classroomGroup.learners.length === 0
  )
    return true;

  return classroomGroup.learners.every(
    (learner) => !!learner.stoppedAttendance
  );
};

export const formatMeetingDays = (programmes?: ClassProgrammeDto[]) => {
  const meetingDays = programmes
    ?.map((programme) => programme.meetingDay)
    .sort();
  let str = '';

  if (meetingDays?.length === 5) {
    str = 'Every Weekday';
  } else {
    for (const meetingDay of meetingDays || []) {
      const _day = getWeekdayValue(meetingDay)?.substring(0, 3);

      if (meetingDay === meetingDays?.at(-1)) {
        str = str.concat(_day);
      } else {
        str = str.concat(_day + ', ');
      }
    }
  }

  return str;
};
