import { differenceInDays } from 'date-fns';

export const getPregnancyWeeks = (deliveryDate: Date | string) => {
  const priordate = new Date(deliveryDate);
  priordate.setDate(new Date(deliveryDate).getDate() - 280);

  const dateDiff = new Date().valueOf() - priordate.valueOf();

  const msInWeek = 1000 * 60 * 60 * 24 * 7;

  const weeksPregnant = Math.round(dateDiff / msInWeek);

  return weeksPregnant;
};

export const getPregnancyDay = (deliveryDate: Date | string) => {
  const diffDates = differenceInDays(new Date(deliveryDate), new Date());

  const actualGestationDay = 280 - diffDates;

  return actualGestationDay < 0 ? 0 : actualGestationDay;
};
