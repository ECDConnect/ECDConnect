import { getWeeksDiff } from '@ecdlink/core';
import { differenceInDays } from 'date-fns';

export const getPregnancyWeeks = (deliveryDate: Date | string) => {
  const diffDates = getWeeksDiff(new Date(), new Date(deliveryDate));
  const actualGestationWeek = 40 - diffDates;

  return actualGestationWeek < 0 ? 0 : actualGestationWeek;
};

export const getPregnancyDay = (deliveryDate: Date | string) => {
  const diffDates = differenceInDays(new Date(deliveryDate), new Date());

  const actualGestationDay = 280 - diffDates;

  return actualGestationDay < 0 ? 0 : actualGestationDay;
};
