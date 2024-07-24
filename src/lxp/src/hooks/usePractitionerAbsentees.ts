import { PractitionerDto } from '@ecdlink/core';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import { add, isAfter, isPast, isToday } from 'date-fns';

export const usePractitionerAbsentees = (practitioner: PractitionerDto) => {
  const practitionerAbsentees = practitioner?.absentees?.map((absent) => ({
    ...absent,
    absentDate: (absent.absentDate as string).replace('Z', ''),
    absentDateEnd: (absent.absentDateEnd as string).replace('Z', ''),
  }));

  const validAbsenteesDates = practitionerAbsentees?.filter(
    (item) =>
      !isPast(new Date(item?.absentDateEnd as string)) ||
      isToday(new Date(item?.absentDate as string))
  );

  const currentDates = validAbsenteesDates?.map((item) => {
    return item?.absentDate as string;
  });

  const orderedDates = currentDates?.sort(function (a, b) {
    return Date.parse(a) - Date.parse(b);
  });

  const currentAbsentee = validAbsenteesDates?.find(
    (item) => item?.absentDate === orderedDates?.[0]
  ) as AbsenteeDto;

  const practitionerIsOnLeave =
    (isToday(new Date(currentAbsentee?.absentDate as string)) ||
      isPast(new Date(currentAbsentee?.absentDate as string))) &&
    !isPast(
      add(new Date(currentAbsentee?.absentDateEnd as string), { days: 1 })
    );

  const isScheduledLeave = currentAbsentee?.absentDate
    ? isAfter(new Date(currentAbsentee.absentDate), new Date())
    : undefined;

  const isMultiDayLeave =
    currentAbsentee?.absentDate && currentAbsentee?.absentDateEnd
      ? isAfter(
          new Date(currentAbsentee.absentDateEnd),
          new Date(currentAbsentee.absentDate)
        )
      : undefined;

  const currentClassesReassigned = validAbsenteesDates?.filter(
    (absentee) => absentee?.absentDate === currentAbsentee?.absentDate
  );

  return {
    practitionerIsOnLeave,
    isScheduledLeave,
    isMultiDayLeave,
    currentAbsentee,
    currentClassesReassigned,
  };
};
