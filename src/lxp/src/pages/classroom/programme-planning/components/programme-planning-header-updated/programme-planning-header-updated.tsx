import { DateFormats } from '@/constants/Dates';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { getWeekdayValue } from '@/utils/practitioner/playgroups-utils';
import { StatusChip, Typography, classNames, Card } from '@ecdlink/ui/';
import { formatISO, getDate, getISODay } from 'date-fns';
import { ProgrammePlanningHeaderProps } from './programme-planning-header-updated.types';
import { Weekdays } from '@/utils/practitioner/playgroups-utils';

export const ProgrammePlanningHeaderUpdated: React.FC<
  ProgrammePlanningHeaderProps
> = ({
  themeName,
  headerText,
  subHeaderText,
  plannedWeeks = 0,
  totalWeeks = 0,
  showCount = true,
  showChips = true,
  className,
  theme,
  chosedTheme,
}) => {
  function titleCase(string: string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  const day = getDate(subHeaderText);
  const weekNumber = getISODay(subHeaderText);
  const dayName = titleCase(String(Weekdays[weekNumber]));
  const dailyProgramme = theme?.dailyProgrammes?.find(
    (item) => item?.dayDate === subHeaderText
  );

  return (
    <div className={classNames(className, 'w-full px-4')}>
      {/* {themeName && themeName !== 'No theme' && showCount && showChips && (
          <>
            <StatusChip
              className={'ml-2'}
              backgroundColour={
                plannedWeeks < totalWeeks || totalWeeks === 0
                  ? 'alertMain'
                  : 'successMain'
              }
              borderColour="transparent"
              textColour="white"
              text={`${plannedWeeks} of ${totalWeeks}`}
            />
            <Typography
              type={'small'}
              text={'weeks planned'}
              color={
                plannedWeeks < totalWeeks || totalWeeks === 0
                  ? 'alertMain'
                  : 'successMain'
              }
              className={'ml-2'}
            />
          </>
        )} */}

      {/* <Typography type="h1" text={headerText} color={'primary'} /> */}
      <div className="flex w-1/4 p-2">
        <Card
          className={
            'bg-primaryAccent2 flex w-full flex-col items-center justify-center rounded-xl p-2'
          }
          borderRaduis={'lg'}
          shadowSize={'lg'}
        >
          <Typography type="body" text={dayName} color="primary" />
          <Typography
            type="small"
            color="primary"
            text={String(day)}
            className="mr-1"
          />
        </Card>
      </div>
      <div className="flex w-3/4 items-center justify-center">
        {showChips && (
          <Card
            className={'bg-infoDark flex w-full items-center rounded-xl p-2'}
          >
            <img src={chosedTheme?.imageUrl} alt="theme" className="h-8 w-8" />
            <Typography
              type="small"
              color="white"
              text={`${themeName}  (Day 20/${theme?.dailyProgrammes?.length})`}
              className={'p-4'}
            />
          </Card>
        )}
      </div>
    </div>
  );
};
