import {
  AttendanceDto,
  ClassProgrammeDto,
  ClassroomGroupDto,
  HolidayDto,
  LearnerDto,
} from '@ecdlink/core';
import { AttendanceStatus, Colours, SubTitleShape } from '@ecdlink/ui';
import {
  addDays,
  format,
  getDay,
  isAfter,
  isFriday,
  isMonday,
  isThursday,
  isTuesday,
  isWednesday,
  startOfWeek,
} from 'date-fns';
import {
  averageScoreThreshold,
  badScoreThreshold,
  goodScoreThreshold,
} from '../../../models/classroom/attendance/ClassAttendance';
import { MissedAttendanceGroups } from '../../../models/classroom/attendance/MissedAttendanceGroups';
import {
  AttendanceState,
  AttendanceStateCheckResult,
} from '../../../pages/classroom/attendance/components/attendance-list/attendance-list.types';
import {
  ChildAttendance,
  TrackAttendanceModelInput,
} from '../../../store/attendance/attendance.types';
import { isWorkingDay } from '../../common/date.utils';
import { Weekdays } from '../../practitioner/playgroups-utils';

export const isValidAttendableDate = (
  date: Date,
  programmeAttendanceDays: number[],
  holidays: HolidayDto[]
) => {
  let isValid = isWorkingDay(date, holidays);

  if (!isValid) return false;

  isValid = isAttendableDay(date, programmeAttendanceDays);

  return isValid;
};

export const isAttendableDay = (date: Date, programmeAttendanceDays: number[]) => {
  let dayFound = false;
  for (const scheduleDay of programmeAttendanceDays) {
    if (dayFound) break;

    switch (scheduleDay) {
      case Weekdays.mon:
        dayFound = isMonday(date);
        break;
      case Weekdays.tue:
        dayFound = isTuesday(date);
        break;
      case Weekdays.wed:
        dayFound = isWednesday(date);
        break;
      case Weekdays.thu:
        dayFound = isThursday(date);
        break;
      case Weekdays.fri:
        dayFound = isFriday(date);
        break;
    }
  }
  return dayFound;
};

export const getMissedClassAttendance = (
  classRoomGroup: ClassroomGroupDto[],
  classProgrammes: ClassProgrammeDto[],
  attendance: AttendanceDto[],
  date: Date
) => {
  const dayOfWeek = getDay(date);
  const currentDayFilter = dayOfWeek === 0 ? 7 : dayOfWeek;
  const returnProgrammes: ClassProgrammeDto[] = [];
  for (const group of classRoomGroup) {
    const groupProgrammes = classProgrammes.filter((x) => x.classroomGroupId === group.id);
    const classProgrammesUpToCurrentDay = groupProgrammes?.filter(
      (x) => (x.meetingDay || -1) <= currentDayFilter
    );

    if (classProgrammesUpToCurrentDay)
      for (const programme of classProgrammesUpToCurrentDay) {
        if (!attendance.some((att) => att.classroomProgrammeId === programme.id)) {
          returnProgrammes.push(programme);
        }
      }
  }
  return returnProgrammes;
};

export const isPracitionerAttendanceMissingForLearner = (
  classRoomGroup: ClassroomGroupDto[],
  classPrgorammes: ClassProgrammeDto[],
  learner: LearnerDto,
  attendance: AttendanceDto[],
  date: Date
) => {
  const learnerGroups = classRoomGroup.filter((x) => x.id === learner.classroomGroupId);
  const missedAttendanceClassProgramme = getMissedClassAttendance(
    learnerGroups,
    classPrgorammes,
    attendance,
    date
  );

  return missedAttendanceClassProgramme && missedAttendanceClassProgramme.length > 0 ? true : false;
};

export const mapTrackAttendance = (
  programmeOwnerId: string,
  attendees: ChildAttendance[],
  attendanceDate: string,
  classroomProgrammeId: string
) => {
  return {
    classroomProgrammeId: classroomProgrammeId,
    attendanceDate: attendanceDate,
    attendees,
    programmeOwnerId,
  } as TrackAttendanceModelInput;
};

export const getMonthName = (monthOfYear: number) => {
  if (monthOfYear < 0 || monthOfYear > 12) return 'Invalid month';
  return format(new Date().setMonth(monthOfYear), 'MMMM');
};

export const getClassroomGroupSchoolDays = (classProgrammes: ClassProgrammeDto[]) => {
  const allMeetingDays = classProgrammes?.map((prog) => prog.meetingDay);
  return allMeetingDays;
};

export const getAllMissedAttendanceGroupsByClassroomGroupId = (
  missedAttendanceGroups: MissedAttendanceGroups[]
) => {
  const allMissedAttendanceDays = missedAttendanceGroups.map(
    (missedAttendance) => missedAttendance.missedDay
  );

  return allMissedAttendanceDays.sort((a, b) => (isAfter(a, b) ? 1 : -1));
};

export const getMissedAttendanceSummaryGroups = (
  classroomGroups: ClassroomGroupDto[],
  classPrgorammes: ClassProgrammeDto[],
  attendance: AttendanceDto[],
  holidays: HolidayDto[],
  currentDate: Date
) => {
  const meetingDays = getClassroomGroupSchoolDays(classPrgorammes);

  if (classroomGroups && classroomGroups?.length > 0) {
    const attendanceToDoList: MissedAttendanceGroups[] = [];

    if (classroomGroups && classroomGroups.length > 0) {
      const missedAttendance = getMissedClassAttendance(
        classroomGroups,
        classPrgorammes,
        attendance,
        currentDate
      );

      const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });

      for (const classroomGroup of classroomGroups) {
        const currentGroupMissedAttendance = missedAttendance.filter(
          (x) => x.classroomGroupId === classroomGroup.id
        );

        for (const missedAttendanceClassProgramme of currentGroupMissedAttendance) {
          const missedDayDate = addDays(
            startOfWeekDate,
            missedAttendanceClassProgramme.meetingDay - 1
          );

          const isValidDay = isValidAttendableDate(missedDayDate, meetingDays || [], holidays);

          if (isValidDay) {
            attendanceToDoList.push({
              classroomGroup: classroomGroup,
              missedDay: missedDayDate,
              classProgramme: missedAttendanceClassProgramme,
            });
          }
        }
      }

      return attendanceToDoList.sort((a, b) => (a.missedDay > b.missedDay ? 1 : -1));
    }
  }

  return [];
};

export const getAttendanceStatusCheck = (
  attendanceGroups: AttendanceState[],
  currentValidStatus: boolean
): AttendanceStateCheckResult => {
  let presentCount = 0,
    absentCount = 0;

  let isValid = currentValidStatus;

  for (const attendanceList of attendanceGroups) {
    if (attendanceList.isRequired) {
      isValid = attendanceList.list.every(
        (x) => x.status === AttendanceStatus.Present || x.status === AttendanceStatus.Absent
      );
    }
    //TD: test t-eq
    presentCount += attendanceList.list.filter((x) => x.status === AttendanceStatus.Present).length;

    absentCount += attendanceList.list.filter((x) => x.status === AttendanceStatus.Absent).length;
  }

  return {
    isValid,
    presentCount,
    absentCount,
  };
};

export const classroomGroupHasAttendanceOnDate = (
  classProgrammes: ClassProgrammeDto[],
  date: Date
): ClassProgrammeDto | undefined => {
  return classProgrammes ? classProgrammes.find((x) => x.meetingDay === getDay(date)) : undefined;
};

export const getPlaygroup = (classProgrammes: ClassProgrammeDto[], date: Date) => {
  return classProgrammes?.find((x) => x.meetingDay === getDay(date));
};

export const getDistinctMeetingDays = (attendance: AttendanceDto[]) => {
  return attendance.reduce((prev, curr) => {
    const attendanceDate = new Date(curr.attendanceDate ?? '');
    const dayOfCurrentItem = getDay(attendanceDate || 0);
    if (prev.indexOf(dayOfCurrentItem) === -1) {
      return [...prev, dayOfCurrentItem];
    }
    return prev;
  }, [] as number[]);
};

export const getShape = (score: number): SubTitleShape => {
  if (score >= goodScoreThreshold) {
    return 'circle';
  }

  if (score > badScoreThreshold) {
    return `triangle`;
  }

  return 'square';
};

export const getShapeClass = (type: SubTitleShape, subTitleColor: Colours) => {
  switch (type) {
    case 'square':
      return `h-2.5 w-2.5 bg-${subTitleColor}`;
    case 'triangle':
      return `h-0 w-0 border-opacity-0 border-t-0 border-l-5 border-l-tranparent border-r-5 border-r-tranparent border-b-10 border-b-${subTitleColor} shadow-none`;
    case 'circle':
      return `h-2.5 w-2.5 rounded-full bg-${subTitleColor}`;
    default:
      return `h-2.5 w-2.5 rounded-full bg-${subTitleColor}`;
  }
};

export const getColor = (score: number): Colours => {
  if (score >= goodScoreThreshold) {
    return 'successDark';
  }

  if (score >= averageScoreThreshold) {
    return 'alertDark';
  }

  return 'errorDark';
};
