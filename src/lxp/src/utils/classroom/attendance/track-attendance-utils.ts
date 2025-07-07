import {
  AttendanceDto,
  ChildAttendanceOverallReportModel,
  ClassProgrammeDto,
  HolidayDto,
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
  isWeekend,
  nextFriday,
  nextMonday,
  nextThursday,
  nextTuesday,
  nextWednesday,
  parse,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import {
  averageScoreThreshold,
  badScoreThreshold,
  goodScoreThreshold,
} from '@models/classroom/attendance/ClassAttendance';
import {
  ClassProgrammeWithMissedDate,
  MissedAttendanceGroups,
} from '@models/classroom/attendance/MissedAttendanceGroups';
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
import {
  ClassroomGroupDto,
  LearnerDto,
  ClassroomGroupDto as SimpleClassroomGroupDto,
} from '@/models/classroom/classroom-group.dto';

export const isValidAttendableDate = (
  date: Date,
  programmeAttendanceDays: number[],
  holidays: HolidayDto[]
) => {
  let isValid = isWorkingDay(date, holidays);

  if (!isValid || programmeAttendanceDays.length === 0) return false;

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

const getLast30BusinessDays = (
  date: Date
): { date: Date; dayOfWeek: number }[] => {
  const businessDays = [];
  let count = 0;

  while (businessDays.length < 30) {
    const currentDate = subDays(date, count);
    businessDays.push({ date: currentDate, dayOfWeek: getDay(currentDate) });
    count++;
  }

  return businessDays.filter((date) => !isWeekend(date.date));
};

export const getMissedClassAttendance = (
  classroomGroups: SimpleClassroomGroupDto[],
  classProgrammes: ClassProgrammeDto[],
  attendance: AttendanceDto[],
  date: Date
) => {
  const dayOfWeek = getDay(date);
  const currentDayFilter = dayOfWeek === 0 ? 7 : dayOfWeek;
  const returnProgrammes: ClassProgrammeWithMissedDate[] = [];

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
      : programStartDate.getTime() < date.getTime();
  });

  const last30BusinessDays = getLast30BusinessDays(date);
  // Map through the last 30 business days
  const last30DaysProgrammes = last30BusinessDays
    // For each day, create an object with the date and the programmes for that day
    ?.map((day) => ({
      date: day.date,
      programmes: classProgrammesUpToCurrentDay?.filter(
        // Filter programmes that occur on the same day of the week as the current day
        // and whose start date is before or on the current day
        (programme) => {
          const checkEndOfDay = new Date(day.date.setHours(23, 59, 59));
          return (
            programme.meetingDay === day.dayOfWeek &&
            new Date(programme.programmeStartDate).getTime() <=
              checkEndOfDay.getTime()
          );
        }
      ),
    }))
    // Filter out days that don't have any programmes
    ?.filter((x) => x.programmes && x.programmes.length > 0)
    // Flatten the array of dayProgrammes into an array of individual programmes with their dates
    ?.flatMap((dayProgrammes) =>
      dayProgrammes.programmes.map((programme) => ({
        date: dayProgrammes.date,
        programme: programme,
      }))
    );

  const meetingDays = getClassroomGroupSchoolDays(
    classProgrammesUpToCurrentDay
  );

  if (last30DaysProgrammes)
    for (const day of last30DaysProgrammes) {
      const programme = day.programme!;
      const missedDayDate = new Date(day.date.setHours(0, 0, 0, 0));

      const classGroups = classroomGroups.filter((x) => {
        return x.id === programme?.classroomGroupId;
      });
      const classLearners = classGroups
        .flatMap((x) => x.learners)
        .filter((x) => {
          const checkEndOfDay = new Date(day.date.setHours(23, 59, 59));
          const isValidDay =
            isValidAttendableDate(missedDayDate, meetingDays || [], []) &&
            checkEndOfDay.getTime() >= new Date(x.startedAttendance).getTime();

          return isValidDay && !Boolean(x.stoppedAttendance);
        });
      if (classLearners && classLearners.length && classLearners.length > 0) {
        if (
          !attendance.some(
            (att) =>
              att.attendanceDate &&
              att.classroomProgrammeId === programme.id &&
              missedDayDate.getTime() ===
                new Date(
                  new Date(att.attendanceDate).setHours(0, 0, 0, 0)
                ).getTime()
          )
        ) {
          returnProgrammes.push({ ...programme, missedDate: missedDayDate });
        }
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
  classProgrammes: ClassProgrammeDto[],
  learner: LearnerDto,
  attendance: AttendanceDto[],
  date: Date
) => {
  const missedAttendanceClassProgramme = getMissedClassAttendanceForLearner(
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
    return x.userId === learner.childUserId;
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

export const getPrevMonth = () => {
  let prevMonth = new Date();
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  return prevMonth;
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
  classroomGroups: SimpleClassroomGroupDto[],
  classProgrammes: ClassProgrammeDto[],
  attendance: AttendanceDto[],
  holidays: HolidayDto[],
  currentDate: Date,
  classroomGroupLearners: LearnerDto[]
) => {
  const dayOfWeek = getDay(currentDate);
  const currentDayFilter = dayOfWeek === 0 ? 7 : dayOfWeek;

  const classProgrammesUpToCurrentDay = classProgrammes?.filter((x) => {
    const programStartDate =
      typeof x.programmeStartDate !== 'undefined'
        ? new Date(x.programmeStartDate)
        : new Date();

    return programStartDate.getUTCDate() === currentDate.getUTCDate()
      ? (x.meetingDay || -1) === currentDayFilter
      : programStartDate.getTime() < currentDate.getTime();
  });

  const meetingDays = getClassroomGroupSchoolDays(
    classProgrammesUpToCurrentDay
  );

  if (classroomGroups?.length > 0) {
    const attendanceToDoList: MissedAttendanceGroups[] = [];

    if (classroomGroups?.length > 0) {
      const missedAttendance = getMissedClassAttendance(
        classroomGroups,
        classProgrammes,
        attendance,
        currentDate
      );

      for (const classroomGroup of classroomGroups) {
        const currentGroupMissedAttendance = missedAttendance.filter(
          (x) => x.classroomGroupId === classroomGroup.id
        );
        for (const missedAttendanceClassProgramme of currentGroupMissedAttendance) {
          const missedDayDate = missedAttendanceClassProgramme.missedDate;

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

interface MergedClassProgramme {
  classroomGroupId: string;
  items: Omit<ClassProgrammeDto, 'classroomGroupId'>[];
}

interface MergedChildAttendanceOverallReportModel {
  classroomGroup?: ClassroomGroupDto;
  classroomGroupId: string;
  items: Omit<ChildAttendanceOverallReportModel, 'classgroupId'>[];
}

export const mergeClassProgrammesWithSameClassroomGroupId = (
  objects: ClassProgrammeDto[]
): MergedClassProgramme[] => {
  const mergedObjects = objects.reduce<Record<string, MergedClassProgramme>>(
    (acc, obj) => {
      const { classroomGroupId, ...rest } = obj;
      if (!acc[classroomGroupId]) {
        acc[classroomGroupId] = { classroomGroupId, items: [rest] };
      } else {
        acc[classroomGroupId].items.push(rest);
      }
      return acc;
    },
    {}
  );

  return Object.values(mergedObjects);
};

export const mergeMonthlyAttendanceReportWithSameClassroomGroupId = (
  objects: ChildAttendanceOverallReportModel[],
  classroomGroups?: ClassroomGroupDto[]
): MergedChildAttendanceOverallReportModel[] => {
  const mergedObjects = objects.reduce<
    Record<string, MergedChildAttendanceOverallReportModel>
  >((acc, obj) => {
    const { classgroupId, ...rest } = obj;

    let classroomGroup: ClassroomGroupDto | undefined;

    if (classroomGroups) {
      const _classroomGroup = classroomGroups.find(
        (x) => x.id === classgroupId
      );
      if (_classroomGroup) {
        classroomGroup = _classroomGroup;
      }
    }

    if (!acc[classgroupId]) {
      acc[classgroupId] = {
        classroomGroupId: classgroupId,
        classroomGroup,
        items: [rest],
      };
    } else {
      acc[classgroupId].items.push(rest);
    }
    return acc;
  }, {});

  return Object.values(mergedObjects);
};
