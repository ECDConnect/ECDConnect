import { DateFormats } from '@/constants/Dates';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { getWeekdayValue } from '@/utils/practitioner/playgroups-utils';
import {
  StatusChip,
  Typography,
  classNames,
  Card,
  Button,
  renderIcon,
  Dropdown,
} from '@ecdlink/ui/';
import {
  add,
  formatDuration,
  formatISO,
  getDate,
  getISODay,
  getMonth,
  getYear,
} from 'date-fns';
import { ProgrammePlanningHeaderProps } from './programme-planning-header-updated.types';
import { Weekdays } from '@/utils/practitioner/playgroups-utils';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { monthsList } from '@ecdlink/core';

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
  onChangeAddDay,
  onChangeSubDay,
  setNewCurrentDailyProgrammeDate,
  weekSummary,
}) => {
  function titleCase(string: string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }
  const [programmeChooseDate, setProgrammeChooseDate] = useState(subHeaderText);
  const day = getDate(programmeChooseDate);
  const weekNumber = getISODay(programmeChooseDate);
  const dayName = titleCase(String(Weekdays[weekNumber]));
  const dailyProgramme =
    programmeChooseDate &&
    theme?.dailyProgrammes?.find((item) => {
      return (
        format(new Date(item?.dayDate), 'd MMM yyyy') ===
        format(new Date(programmeChooseDate), 'd MMM yyyy')
      );
    });
  const [chooseDayIndex, setChooseDayIndex] = useState(dailyProgramme?.day);
  const disableAddDay = dailyProgramme?.day === theme?.dailyProgrammes.length;
  const disableSubDay = dailyProgramme?.day === 1;
  const [month, setMonth] = useState<string | undefined>();
  const currentMonth = getMonth(programmeChooseDate);
  const currentYear = getYear(programmeChooseDate);
  const monthDropdownLabel = monthsList[currentMonth]?.label;

  useEffect(() => {
    if (subHeaderText) {
      setProgrammeChooseDate(subHeaderText);
    }
  }, [subHeaderText]);

  useEffect(() => {
    if (chooseDayIndex) {
      const newDate = theme?.dailyProgrammes?.find((item) => {
        return item?.day === chooseDayIndex;
      });
      setProgrammeChooseDate(new Date(newDate?.dayDate!));
    }
  }, [chooseDayIndex, theme?.dailyProgrammes]);

  const addDay = () => {
    if (dailyProgramme?.day !== theme?.dailyProgrammes.length) {
      setChooseDayIndex(chooseDayIndex + 1);
      setNewCurrentDailyProgrammeDate(programmeChooseDate);
      addCurrentDay();
    }
  };

  const subDay = () => {
    if (dailyProgramme?.day !== 1) {
      setChooseDayIndex(chooseDayIndex - 1);
      setNewCurrentDailyProgrammeDate(programmeChooseDate);
      subCurrentDay();
    }
  };

  const addCurrentDay = useCallback(() => {
    if (programmeChooseDate !== subHeaderText && onChangeAddDay) {
      onChangeAddDay();
    }
  }, [onChangeAddDay, programmeChooseDate, subHeaderText]);

  const subCurrentDay = useCallback(() => {
    if (programmeChooseDate && onChangeSubDay) {
      onChangeSubDay();
    }
  }, [onChangeSubDay, programmeChooseDate]);

  return (
    <div>
      {!weekSummary && (
        <div className="flex w-full items-center justify-between p-4">
          <div
            className={`flex flex-row items-center justify-center ${
              disableSubDay ? 'pointer-events-none opacity-70' : ''
            }`}
            onClick={subDay}
          >
            {renderIcon('ChevronLeftIcon', 'h-6 w-6 text-textMid')}
          </div>
          <Dropdown
            showSearch
            placeholder={`${monthDropdownLabel} ${currentYear}`}
            list={monthsList}
            selectedValue={month}
            onChange={() => setMonth(monthsList[currentMonth]?.label)}
          />
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
            {renderIcon('CalendarIcon', 'h-5 w-5 text-white')}
          </div>
          <div
            className={`flex flex-row items-center justify-center ${
              disableAddDay ? 'pointer-events-none opacity-70' : ''
            }`}
            onClick={addDay}
          >
            {renderIcon('ChevronRightIcon', 'h-6 w-6 text-textMid')}
          </div>
        </div>
      )}
      <div className={classNames(className, 'flex w-full gap-2 px-4')}>
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
              <img
                src={chosedTheme?.imageUrl}
                alt="theme"
                className="h-8 w-8"
              />
              <Typography
                type="small"
                color="white"
                text={`${themeName}  (Day ${dailyProgramme?.day}/${theme?.dailyProgrammes?.length})`}
                className={'p-4'}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
