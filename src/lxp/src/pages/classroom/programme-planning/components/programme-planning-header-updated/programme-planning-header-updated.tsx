import {
  Typography,
  classNames,
  Card,
  renderIcon,
  Dropdown,
} from '@ecdlink/ui/';
import {
  addDays,
  addMonths,
  getDate,
  getISODay,
  getMonth,
  getYear,
  isSameDay,
  subDays,
} from 'date-fns';
import { ProgrammePlanningHeaderProps } from './programme-planning-header-updated.types';
import { Weekdays } from '@/utils/practitioner/playgroups-utils';
import { useCallback, useState } from 'react';
import { monthsList } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import { programmeThemeSelectors } from '@/store/content/programme-theme';

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
  setSelectedDate,
  selectedDate,
  weekSummary,
  isWeekendDay,
}) => {
  function titleCase(string: string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }
  const day = getDate(selectedDate!);
  const weekNumber = getISODay(selectedDate!);
  const dayName = titleCase(String(Weekdays[weekNumber]));
  const dailyProgramme = theme?.dailyProgrammes?.find((item) => {
    return isSameDay(new Date(item?.dayDate), new Date(selectedDate!));
  });
  const [month, setMonth] = useState<string | undefined>();
  const currentMonth = getMonth(selectedDate!);
  const currentYear = getYear(new Date());
  const monthDropdownLabel = monthsList[currentMonth]?.label;
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  const chosedTheme = themes?.find((item) => item?.name === theme?.name);
  const isCurrentDay = isSameDay(selectedDate!, new Date());
  const addDay = useCallback(() => {
    setSelectedDate(addDays(selectedDate!, 1));
  }, [selectedDate, setSelectedDate]);
  // Business rule to only go back 3 months and forward 6 months
  const threeMonthsBack: Date = addMonths(selectedDate!, -3);
  const sixMonthsForward: Date = addMonths(selectedDate!, 6);

  const subDay = useCallback(() => {
    var selectDate = new Date(selectedDate!);
    if (selectDate >= threeMonthsBack && selectDate <= sixMonthsForward) {
      setSelectedDate(subDays(selectedDate!, 1));
    }
  }, [selectedDate, setSelectedDate]);

  const setDayCurrentDate = () => {
    var selectDate = new Date(selectedDate!);
    if (selectDate >= threeMonthsBack && selectDate <= sixMonthsForward) {
      setSelectedDate(selectDate!, 1);
    }
  };

  return (
    <div>
      {!weekSummary && (
        <div className="flex w-full items-center justify-between p-4">
          <div
            className={`flex flex-row items-center justify-center`}
            onClick={subDay}
          >
            {renderIcon('ChevronLeftIcon', 'h-6 w-6 text-textMid')}
          </div>
          <Dropdown
            placeholder={`${monthDropdownLabel} ${currentYear}`}
            list={monthsList}
            selectedValue={month}
            onChange={(item) => {
              setMonth(monthsList[currentMonth]?.label);
              setSelectedDate(
                new Date(currentYear, Number(item), 1) < new Date()
                  ? new Date()
                  : new Date(currentYear, Number(item) - 1, 1)
              );
            }}
            fillColor="secondary"
            textColor="white"
            fillType="filled"
            labelColor="white"
            className="w-36"
          />
          <div
            className="bg-primary flex h-8 w-8 items-center justify-center rounded-full"
            onClick={setDayCurrentDate}
          >
            {renderIcon('CalendarIcon', 'h-5 w-5 text-white')}
          </div>
          <div
            className={`flex flex-row items-center justify-center `}
            onClick={addDay}
          >
            {renderIcon('ChevronRightIcon', 'h-6 w-6 text-textMid')}
          </div>
        </div>
      )}
      <div className={classNames(className, 'flex w-full gap-2 px-4')}>
        <div className="flex w-1/4 p-2">
          <Card
            className={`${
              isCurrentDay ? 'bg-secondaryAccent2' : 'bg-primaryAccent2'
            } flex w-full flex-col items-center justify-center rounded-xl p-2`}
            borderRaduis={'lg'}
            shadowSize={'lg'}
          >
            <Typography
              type="body"
              text={dayName}
              color={isCurrentDay ? `secondary` : `primary`}
              weight={`bold`}
            />
            <Typography
              type="small"
              color={isCurrentDay ? `secondary` : `primary`}
              text={String(day)}
              className="mr-1"
              weight={`bold`}
            />
          </Card>
        </div>
        {!isWeekendDay && (
          <div className="flex w-3/4 items-center justify-center">
            {showChips && (
              <Card className={`flex w-full items-center rounded-xl p-2`}>
                <div
                  className={`flex w-full items-center rounded-xl p-2 ${
                    !chosedTheme ? 'bg-uiBg' : ''
                  }`}
                  style={{
                    backgroundColor: chosedTheme?.color || 'bg-uiBg',
                  }}
                >
                  {chosedTheme && (
                    <img
                      src={chosedTheme?.imageUrl}
                      alt="theme"
                      className="h-8 w-8"
                    />
                  )}
                  {dailyProgramme && theme?.dailyProgrammes?.length ? (
                    <Typography
                      type="small"
                      color={chosedTheme ? 'white' : 'textDark'}
                      text={
                        themeName
                          ? `${themeName}  (Day ${dailyProgramme?.day}/${theme?.dailyProgrammes?.length})`
                          : `No theme`
                      }
                      className={'p-4'}
                      weight={`bold`}
                    />
                  ) : (
                    <Typography
                      type="small"
                      color={chosedTheme ? 'white' : 'textDark'}
                      text={`${themeName}`}
                      className={'p-4'}
                      weight={`bold`}
                    />
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
