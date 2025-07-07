import { Weekdays } from '../../practitioner/playgroups-utils';

const monWedMessage = 'Great job, you submitted today’s register!';
const tueThuMessage = "Well done for submitting today's register!";
const friMessage = "Great job, you submitted today's register! ";

export const getPointsMessage = (isSmartStartUser: boolean) => {
  const dateToday = new Date();
  switch (dateToday.getDay()) {
    case Weekdays.mon:
      return monWedMessage;
    case Weekdays.tue:
      return tueThuMessage;
    case Weekdays.wed:
      return monWedMessage;
    case Weekdays.thu:
      return tueThuMessage;
    case Weekdays.fri:
      return friMessage;
    default:
      return monWedMessage;
  }
};
