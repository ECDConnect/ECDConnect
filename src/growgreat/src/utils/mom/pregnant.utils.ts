import { getWeeksDiff } from '@ecdlink/core';

export const getPregnancyWeeks = (deliveryDate: Date | string) => {
  const diffDates = getWeeksDiff(new Date(), new Date(deliveryDate));
  const actualGestationWeek = 40 - diffDates;

  return actualGestationWeek < 0 ? 0 : actualGestationWeek;
};
