import { PractitionerDto } from '@ecdlink/core';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import { add, isPast, isToday } from 'date-fns';

export const usePractitionerAbsentees = (practitioner: PractitionerDto) => {
  const practitionerAbsentees = practitioner?.absentees;

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

  return { practitionerIsOnLeave, currentAbsentee };
};
