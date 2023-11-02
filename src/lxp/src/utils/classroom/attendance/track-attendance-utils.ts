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
  endOfMonth,
  format,
  getDay,
  getDayOfYear,
  isBefore,
  isFriday,
  isMonday,
  isThursday,
  isTuesday,
  isWednesday,
  nextFriday,
  nextMonday,
  nextThursday,
  nextTuesday,
  nextWednesday,
  parse,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import {
  averageScoreThreshold,
  badScoreThreshold,
  goodScoreThreshold,
} from '@models/classroom/attendance/ClassAttendance';
import { MissedAttendanceGroups } from '@models/classroom/attendance/MissedAttendanceGroups';
import {
  AttendanceState,
  AttendanceStateCheckResult,
} from '../../../pages/classroom/attendance/components/attendance-list/attendance-list.types';
import {
  ChildAttendance,
  TrackAttendanceModelInput,
} from '@store/attendance/attendance.types';
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

export const isAttendableDay = (
  date: Date,
  programmeAttendanceDays: number[]
) => {
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

export const nextAttendableDateAfterStartDate = (
  programmeStartDate: Date,
  meetingDay: number
) => {
  let nextAttendableDate = new Date();

  switch (meetingDay) {
    case Weekdays.mon:
      nextAttendableDate = nextMonday(programmeStartDate);
      break;
    case Weekdays.tue:
      nextAttendableDate = nextTuesday(programmeStartDate);
      break;
    case Weekdays.wed:
      nextAttendableDate = nextWednesday(programmeStartDate);
      break;
    case Weekdays.thu:
      nextAttendableDate = nextThursday(programmeStartDate);
      break;
    case Weekdays.fri:
      nextAttendableDate = nextFriday(programmeStartDate);
      break;
    default:
      nextAttendableDate = programmeStartDate;
  }
  return nextAttendableDate;
};

export const getMissedClassAttendance = (
  classRoomGroups: ClassroomGroupDto[],
  classProgrammes: ClassProgrammeDto[],
  attendance: AttendanceDto[],
  date: Date,
  classroomGroupLearners?: LearnerDto[]
) => {
  const dayOfWeek = getDay(date);
  const currentDayFilter = dayOfWeek === 0 ? 7 : dayOfWeek;
  const returnProgrammes: ClassProgrammeDto[] = [];

  const groupProgrammes = classProgrammes;

  // all the class programs for up until today but does not check the start date
  const classProgrammesUpToCurrentDay = groupProgrammes?.filter((x) => {
    const programStartDate =
      typeof x.programmeStartDate !== 'undefined'
        ? new Date(x.programmeStartDate)
        : new Date();
    const programStartDateDay = getDayOfYear(programStartDate);
    const dateDay = getDayOfYear(date);

    return programStartDateDay === dateDay
      ? (x.meetingDay || -1) === currentDayFilter
      : (x.meetingDay || -1) <= currentDayFilter &&
          isBefore(programStartDateDay, dateDay);
  });

  if (classProgrammesUpToCurrentDay)
    for (const programme of classProgrammesUpToCurrentDay) {
      const classGroups = classRoomGroups.filter((x) => {
        return x.id === programme.classroomGroupId;
      });
      const classLearners = classroomGroupLearners?.filter((x) => {
        return classGroups.some((item) => item.id === x.classroomGroupId);
      });
      if (
        classLearners &&
        classLearners.length &&
        classLearners.length > 0 &&
        !attendance.some((att) => att.classroomProgrammeId === programme.id)
      ) {
        returnProgrammes.push(programme);
      }
    }

  return returnProgrammes;
};

export const removeDuplicates = (arr: MissedAttendanceGroups[]) => {
  const seen = new Set();

  return arr.filter((obj) => {
    const classroomGroupId = obj.classroomGroup.id;
    if (!seen.has(classroomGroupId)) {
      seen.add(classroomGroupId);
      return true;
    }
    return false;
  });
};

export const isPractitionerAttendanceMissingForLearner = (
  classRoomGroup: ClassroomGroupDto[],
  classProgrammes: ClassProgrammeDto[],
  learner: LearnerDto,
  attendance: AttendanceDto[],
  date: Date
) => {
  const learnerGroups = classRoomGroup.filter(
    (x) => x.id === learner.classroomGroupId
  );
  const missedAttendanceClassProgramme = getMissedClassAttendanceForLearner(
    learnerGroups,
    classProgrammes,
    attendance,
    date,
    learner
  );

  return missedAttendanceClassProgramme &&
    missedAttendanceClassProgramme.length > 0
    ? true
    : false;
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

export const getMissedClassAttendanceForLearner = (
  classRoomGroups: ClassroomGroupDto[],
  classProgrammes: ClassProgrammeDto[],
  attendance: AttendanceDto[],
  date: Date,
  learner: LearnerDto
) => {
  const dayOfWeek = getDay(date);
  const currentDayFilter = dayOfWeek === 0 ? 7 : dayOfWeek;
  const returnProgrammes: ClassProgrammeDto[] = [];

  const groupProgrammes = classProgrammes;

  // all the class programs for up until today but does not check the start date
  const classProgrammesUpToCurrentDay = groupProgrammes?.filter((x) => {
    const programStartDate =
      typeof x.programmeStartDate !== 'undefined'
        ? new Date(x.programmeStartDate)
        : new Date();
    const programStartDateDay = getDayOfYear(programStartDate);
    const dateDay = getDayOfYear(date);

    return programStartDateDay === dateDay
      ? (x.meetingDay || -1) === currentDayFilter
      : (x.meetingDay || -1) <= currentDayFilter &&
          isBefore(programStartDateDay, dateDay);
  });

  const learnerAttendance = attendance.filter((x) => {
    return x.userId === learner.userId;
  });

  const meetingDays = getClassroomGroupSchoolDays(
    classProgrammesUpToCurrentDay
  );
  const startOfWeekDate = startOfWeek(new Date().setHours(23, 59, 59, 999), {
    weekStartsOn: 1,
  });

  if (classProgrammesUpToCurrentDay)
    for (const programme of classProgrammesUpToCurrentDay) {
      const missedDayDate = addDays(startOfWeekDate, programme.meetingDay - 1);

      const isValidDay =
        isValidAttendableDate(missedDayDate, meetingDays || [], []) &&
        missedDayDate.getTime() >=
          new Date(learner.startedAttendance).getTime();

      if (
        isValidDay &&
        !learnerAttendance.some(
          (att) => att.classroomProgrammeId === programme.id
        )
      ) {
        returnProgrammes.push(programme);
      }
    }
  return returnProgrammes;
};

export const getMonthName = (monthOfYear: number) => {
  if (monthOfYear < 0 || monthOfYear > 12) return 'Invalid month';
  return format(new Date().setMonth(monthOfYear), 'MMMM');
};
export function getMonthRange(monthName: string) {
  const year = new Date().getFullYear();
  // Parse the month name and get the corresponding month number
  const monthNumber = parse(monthName, 'MMMM', new Date()).getMonth() + 1;
  // Get the start and end date of the month
  const startDate = startOfMonth(new Date(year, monthNumber - 1, 1));

  const endDate = endOfMonth(new Date(year, monthNumber - 1, 1));

  return { startDate, endDate };
}

export const getClassroomGroupSchoolDays = (
  classProgrammes: ClassProgrammeDto[]
) => {
  const allMeetingDays = classProgrammes?.map((prog) => prog.meetingDay);
  return allMeetingDays;
};

export const getAllMissedAttendanceGroupsByClassroomGroupId = (
  missedAttendanceGroups: MissedAttendanceGroups[],
  id: string
) => {
  const missedDays: Date[] = [];
  missedAttendanceGroups.forEach((obj) => {
    if (obj.classroomGroup.id === id) {
      const missedDay = new Date(obj.missedDay);
      if (!isNaN(missedDay.getTime())) {
        missedDays.push(missedDay);
      }
    }
  });

  return missedDays;
};

export const getMissedAttendanceSummaryGroups = (
  classroomGroups: ClassroomGroupDto[],
  classProgrammes: ClassProgrammeDto[],
  attendance: AttendanceDto[],
  holidays: HolidayDto[],
  currentDate: Date,
  classroomGroupLearners: LearnerDto[]
) => {
  const meetingDays = getClassroomGroupSchoolDays(classProgrammes);

  if (classroomGroups?.length > 0) {
    const attendanceToDoList: MissedAttendanceGroups[] = [];

    if (classroomGroups?.length > 0) {
      const missedAttendance = getMissedClassAttendance(
        classroomGroups,
        classProgrammes,
        attendance,
        currentDate,
        classroomGroupLearners
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

          const isValidDay = isValidAttendableDate(
            missedDayDate,
            meetingDays || [],
            holidays
          );

          if (isValidDay) {
            attendanceToDoList.push({
              classroomGroup: classroomGroup,
              missedDay: missedDayDate,
              classProgramme: missedAttendanceClassProgramme,
            });
          }
        }
      }

      return attendanceToDoList.sort((a, b) =>
        a.missedDay > b.missedDay ? 1 : -1
      );
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
        (x) =>
          x.status === AttendanceStatus.Present ||
          x.status === AttendanceStatus.Absent
      );
    }
    //TD: test t-eq
    presentCount += attendanceList.list.filter(
      (x) => x.status === AttendanceStatus.Present
    ).length;

    absentCount += attendanceList.list.filter(
      (x) => x.status === AttendanceStatus.Absent
    ).length;
  }

  return {
    isValid,
    presentCount,
    absentCount,
  };
};

export const classroomGroupHasAttendanceOnDate = (
  classProgrammes: ClassProgrammeDto[],
  date: Date,
  selectedclassroomGroupId?: string
): ClassProgrammeDto | undefined => {
  if (selectedclassroomGroupId === '') {
    return classProgrammes
      ? classProgrammes.find((x) => x.meetingDay === getDay(date))
      : undefined;
  } else {
    return classProgrammes
      ? classProgrammes.find(
          (x) =>
            x.meetingDay === getDay(date) &&
            x.classroomGroupId === selectedclassroomGroupId
        )
      : undefined;
  }
};

export const classroomGroupHasAttendanceDate = (
  classProgrammes: ClassProgrammeDto[],
  date: Date,
  previousClassroomID?: string
): ClassProgrammeDto | undefined => {
  return classProgrammes
    ? classProgrammes.length > 5
      ? classProgrammes.find(
          (x) =>
            x.classroomGroupId !== previousClassroomID &&
            x.meetingDay === getDay(date)
        )
      : classProgrammes.find((x) => x.meetingDay === getDay(date))
    : undefined;
};

export const getPlaygroup = (
  classProgrammes: ClassProgrammeDto[],
  date: Date,
  selectedclassroomGroupId?: string
) => {
  if (selectedclassroomGroupId === '') {
    return classProgrammes?.find((x) => x.meetingDay === getDay(date));
  } else {
    return classProgrammes?.find(
      (x) =>
        x.meetingDay === getDay(date) &&
        x.classroomGroupId === selectedclassroomGroupId
    );
  }
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
