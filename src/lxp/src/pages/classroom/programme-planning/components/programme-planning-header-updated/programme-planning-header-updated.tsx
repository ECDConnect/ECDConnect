import {
  Typography,
  classNames,
  Card,
  renderIcon,
  Dropdown,
} from '@ecdlink/ui/';
import { getDate, getISODay, getMonth, getYear } from 'date-fns';
import { ProgrammePlanningHeaderProps } from './programme-planning-header-updated.types';
import { Weekdays } from '@/utils/practitioner/playgroups-utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
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
}) => {
  function titleCase(string: string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }
  const [programmeChooseDate, setProgrammeChooseDate] = useState(subHeaderText);
  const day = getDate(selectedDate! || programmeChooseDate);
  const weekNumber = getISODay(selectedDate! || programmeChooseDate);
  const dayName = titleCase(String(Weekdays[weekNumber]));
  const dailyProgramme =
    programmeChooseDate &&
    theme?.dailyProgrammes?.find((item) => {
      return (
        format(new Date(item?.dayDate), 'd MMM yyyy') ===
        format(new Date(selectedDate! || programmeChooseDate), 'd MMM yyyy')
      );
    });
  console.log({ theme });

  const [chooseDayIndex, setChooseDayIndex] = useState(dailyProgramme?.day);
  const disableAddDay = dailyProgramme?.day === theme?.dailyProgrammes.length;
  const disableSubDay = dailyProgramme?.day === 1;
  const [month, setMonth] = useState<string | undefined>();
  const currentMonth = getMonth(selectedDate || programmeChooseDate);
  const currentYear = getYear(programmeChooseDate || new Date());
  const monthDropdownLabel = monthsList[currentMonth]?.label;
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  const chosedTheme = themes?.find((item) => item?.name === theme?.name);

  useEffect(() => {
    if (subHeaderText) {
      setProgrammeChooseDate(subHeaderText);
    }
  }, [subHeaderText]);

  const addDay = () => {
    if (Number(dailyProgramme?.day) !== theme?.dailyProgrammes.length) {
      const updatedIndex = Number(chooseDayIndex) + 1;
      setChooseDayIndex(updatedIndex);
      const newDate = theme?.dailyProgrammes?.find((item) => {
        return Number(item?.day) === Number(updatedIndex);
      });
      setProgrammeChooseDate(new Date(newDate?.dayDate!));
      setSelectedDate(new Date(newDate?.dayDate!));
    }
  };

  const subDay = () => {
    if (Number(dailyProgramme?.day) !== 1) {
      const updatedIndex = Number(chooseDayIndex) - 1;
      setChooseDayIndex(updatedIndex);
      const newDate = theme?.dailyProgrammes?.find((item) => {
        return Number(item?.day) === Number(updatedIndex);
      });
      setProgrammeChooseDate(new Date(newDate?.dayDate!));
      setSelectedDate(new Date(newDate?.dayDate!));
    }
  };

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
            placeholder={`${monthDropdownLabel} ${currentYear}`}
            list={monthsList}
            selectedValue={month}
            onChange={() => setMonth(monthsList[currentMonth]?.label)}
            fillColor="secondary"
            textColor="white"
            fillType="filled"
            labelColor="white"
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
            <Typography
              type="body"
              text={dayName}
              color="primary"
              weight={`bold`}
            />
            <Typography
              type="small"
              color="primary"
              text={String(day)}
              className="mr-1"
              weight={`bold`}
            />
          </Card>
        </div>
        <div className="flex w-3/4 items-center justify-center">
          {showChips && (
            <Card className={`flex w-full items-center rounded-xl p-2`}>
              <div
                className={`flex w-full items-center rounded-xl p-2`}
                style={{
                  backgroundColor: chosedTheme?.color || 'bg-primaryAccent2',
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
                    text={`${themeName}  (Day ${dailyProgramme?.day}/${theme?.dailyProgrammes?.length})`}
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
      </div>
    </div>
  );
};
