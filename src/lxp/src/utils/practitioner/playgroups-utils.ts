import { ClassroomGroupDto } from '@ecdlink/core';
import { EditPlaygroupModel } from '@schemas/practitioner/edit-playgroups';
import { newGuid } from '../common/uuid.utils';

export enum Weekdays {
  mon = 1,
  tue = 2,
  wed = 3,
  thu = 4,
  fri = 5,
}

export const generateEmptyPlaygroups = (
  numberOfPlaygroups: number
): EditPlaygroupModel[] => {
  const playGroups: EditPlaygroupModel[] = [];
  for (let i = 0; i < numberOfPlaygroups; i++) {
    playGroups.push({ name: '', meetingDays: [], classroomGroupId: newGuid() });
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
