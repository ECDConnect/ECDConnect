import { Maybe, Visit } from '@ecdlink/graphql';
import { Colours } from '@ecdlink/ui';
import { differenceInMonths, parseISO } from 'date-fns';

export interface RatingData {
  text: string;
  icon: JSX.Element;
  color: Colours;
}

export const followUpDeadline = { default: 14, lastVisit: 60 };

export const getRatingData = (
  overallRatingColor?: Maybe<string>
): RatingData => {
  switch (overallRatingColor) {
    case 'Error':
      return {
        text: 'Red rating',
        icon: <span className="text-errorMain text-xl">■</span>,
        color: 'errorMain',
      };
    case 'Warning':
      return {
        text: 'Orange rating',
        icon: <span className="text-alertMain text-xs">▲</span>,
        color: 'alertMain',
      };
    default:
      return {
        text: 'Green rating',
        icon: <span className="text-successMain text-xl">●</span>,
        color: 'successMain',
      };
  }
};

export const isDateWithinThreeMonths = (inputDateStr: string): boolean => {
  const inputDate = parseISO(inputDateStr);
  const currentDate = new Date();

  const monthDifference = differenceInMonths(inputDate, currentDate);

  return monthDifference <= 3;
};

export const sortVisits = (visits: Maybe<Visit>[]) => {
  return [...visits]?.sort((a, b) => {
    if (!a?.attended && !b?.attended) {
      return 0;
    } else if (!a?.attended) {
      return 1;
    } else if (!b?.attended) {
      return -1;
    }

    return (
      new Date(a.actualVisitDate).getTime() -
      new Date(b.actualVisitDate).getTime()
    );
  });
};

export function divideArrayByFollowUp(
  visits: Maybe<Visit>[]
): Maybe<Visit>[][] {
  return visits.reduce((acc: Maybe<Visit>[][], visit) => {
    const isFollowUp = visit?.visitType?.name?.includes('follow_up');
    if (!isFollowUp) {
      // If not a "follow-up", start a new sub-array with this element
      acc.push([visit]);
    } else if (acc.length > 0) {
      // If it's a "follow-up", add to the last sub-array created
      acc[acc.length - 1].push(visit);
    }

    return acc;
  }, []);
}

export const getScheduleOrStartButtonText = (
  item: Maybe<Visit> | undefined
) => {
  if (!item?.eventId) {
    return 'Schedule';
  }
  return 'Start';
};

export const getScheduleOrStartButtonIcon = (
  item: Maybe<Visit> | undefined
) => {
  if (!item?.eventId) {
    return 'CalendarIcon';
  }
  return 'ArrowCircleRightIcon';
};

export const getScheduleOrStartSubTitleText = (
  item: Maybe<Visit> | undefined
) => {
  if (!!item?.eventId) {
    return 'Scheduled ';
  }

  if (!item?.attended) {
    return 'By ';
  }

  return '';
};
