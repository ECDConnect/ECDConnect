import { Button, Typography, renderIcon } from '@ecdlink/ui';
import WeekendEmoji from '../../../../../../assets/positive-bonus-emoticon.png';
import { isSaturday, nextMonday } from 'date-fns';
import { DailyProgrammeDto } from '@/../../../packages/core/lib';

interface HolidayProps {
  date: Date;
  nextProgrammeDaysWithoutActivity: DailyProgrammeDto[];
  setSelectedDate: (date: Date) => void;
}

export const WeekendDayIndicator: React.FC<HolidayProps> = ({
  date,
  nextProgrammeDaysWithoutActivity,
  setSelectedDate,
}) => {
  const isSaturdayDay = isSaturday(new Date(date!));

  return (
    <div className={'flex flex-auto flex-col items-center justify-center'}>
      <div>
        <img
          src={WeekendEmoji}
          alt="weekend emoji"
          className="mt-8 h-28 w-28"
        />
      </div>
      <Typography
        type="body"
        className="mt-4"
        fontSize="16"
        align="center"
        weight="bold"
        text={`Happy ${
          isSaturdayDay ? 'Saturday' : 'Sunday'
        }! You can start planning next week.`}
      />
      <Typography
        type="body"
        className="mt-1 w-1/2"
        align={'center'}
        weight="skinny"
        text={
          nextProgrammeDaysWithoutActivity?.length
            ? `You have ${nextProgrammeDaysWithoutActivity?.length} ${
                nextProgrammeDaysWithoutActivity?.length === 1 ? 'day' : 'days'
              } to plan next week`
            : `You have a plan for every day next week, great job!`
        }
        color={'textMid'}
        fontSize="14"
      />
      <div className={'pt-2'}>
        <Button
          color={'secondary'}
          type={'outlined'}
          onClick={() =>
            nextProgrammeDaysWithoutActivity?.length
              ? setSelectedDate(
                  new Date(nextProgrammeDaysWithoutActivity?.[0]?.dayDate!)
                )
              : setSelectedDate(nextMonday(new Date(date)))
          }
          className={'mt-4 mb-4 w-full'}
        >
          {renderIcon('ClipboardListIcon', `w-5 h-5 text-secondary`)}
          <Typography
            color={'secondary'}
            type={'help'}
            weight={'normal'}
            text={'Start planning'}
          />
        </Button>
      </div>
    </div>
  );
};
