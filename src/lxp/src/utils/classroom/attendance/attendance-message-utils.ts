import { Weekdays } from '../../practitioner/playgroups-utils';

const monWedMessage = 'Great job, you submitted today’s register!';
const tueThuMessage = "Well done for submitting today's register!";
const friMessage = "Great job, you submitted today's register! ";
const oneStepCloserPointsMessage =
  "You're one step closer to earning 100 points this month!";

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
      return (
        friMessage + (isSmartStartUser ? ' ' + oneStepCloserPointsMessage : '')
      );
    default:
      return monWedMessage;
  }
};
