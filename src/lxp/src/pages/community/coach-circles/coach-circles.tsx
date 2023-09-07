import { getQuarterMonths } from '@/utils/common/date.utils';
import { Typography } from '@ecdlink/ui';
import { format, getQuarter, getYear, lastDayOfQuarter } from 'date-fns';

export const CoachCircles = () => {
  const date = new Date();
  const quarter = getQuarter(date);
  const year = getYear(date);
  const quarterMonths = getQuarterMonths(date);
  const quarterLastDay = format(lastDayOfQuarter(date), 'd MMM');
  return (
    <div className="p-4">
      <Typography
        type="h2"
        color="textDark"
        text={`Coaching circles - Quarter ${quarter}`}
      ></Typography>
      <Typography
        type="body"
        color="textMid"
        text={`${quarterMonths} of ${year}`}
      ></Typography>
      <Typography
        type="body"
        color="textMid"
        text={`Schedule a coaching circle with these clubs before ${quarterLastDay}:`}
        className="pt-4"
      ></Typography>
      <Typography
        type="body"
        color="textMid"
        text={`Coaching circles held this quarter:`}
        className="pt-4"
      ></Typography>
    </div>
  );
};
