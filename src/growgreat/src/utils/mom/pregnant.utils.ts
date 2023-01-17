import { getWeeksDiff } from '@ecdlink/core';

export const getWeeksPregnant = (deliveryDate: Date | string) => {
  const diffDates = getWeeksDiff(new Date(), new Date(deliveryDate));
  const actualGestationWeek = 40 - diffDates;

  return actualGestationWeek;
};
