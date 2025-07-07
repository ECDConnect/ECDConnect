import {
  Typography,
  classNames,
  renderIcon,
  Dropdown,
  DropDownOption,
  Button,
  DialogPosition,
} from '@ecdlink/ui/';
import { addDays, addMonths, isSameDay, subDays } from 'date-fns';
import { ProgrammePlanningHeaderProps } from './programme-planning-header-updated.types';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  programmeThemeSelectors,
  programmeThemeThunkActions,
} from '@/store/content/programme-theme';
import format from 'date-fns/format';
import { useHistory, useParams } from 'react-router';
import { ProgrammeDashboardRouteParams } from '../../programme-dashboard/programme-dashboard.types';
import { classroomsSelectors } from '@/store/classroom';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@/store';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useDialog } from '@ecdlink/core';
import { ProgrammeTimingRouteState } from '../../programme-timing/programme-timing.types';
import { ProgrammeThemeRouteState } from '../../programme-theme/programme-theme.types';
import { useAppContext } from '@/walkthrougContext';
import axios from 'axios';
import { useHolidays } from '@/hooks/useHolidays';
import { staticDataThunkActions } from '@/store/static-data';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { practitionerSelectors } from '@/store/practitioner';

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
  chosedTheme,
}) => {
  const { classroomGroupId } = useParams<ProgrammeDashboardRouteParams>();

  const { hasPermissionToPlanClassroomActivities } = useUserPermissions();
  const isTrialPeriod = useIsTrialPeriod();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const hasPermissionToEdit =
    practitioner?.isPrincipal ||
    hasPermissionToPlanClassroomActivities ||
    isTrialPeriod;

  const {
    state: { run: isWalkthrough },
  } = useAppContext();

  const { isOnline } = useOnlineStatus();
  const dailyProgramme = theme?.dailyProgrammes?.find((item) => {
    return isSameDay(new Date(item?.dayDate), new Date(selectedDate!));
  });
  const [month, setMonth] = useState<string | undefined>();
  const [svgImageBase64, setSvgImageBase64] = useState<string | undefined>();

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(classroomGroupId)
  );
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  //const chosenTheme = themes?.find((item) => item?.name === theme?.name);

  const appDispatch = useAppDispatch();

  const dialog = useDialog();

  const history = useHistory();

  const holiday = useHolidays();

  // Business rule to only go back 3 months and forward 6 months
  const threeMonthsBack: Date = addMonths(selectedDate!, -3);
  const sixMonthsForward: Date = addMonths(selectedDate!, 6);

  const themeColour = () => {
    if (chosedTheme?.color) return chosedTheme.color;
    return 'bg-uiBg';
  };

  const addDay = useCallback(() => {
    var selectDate = new Date(selectedDate!);
    if (selectDate >= threeMonthsBack && selectDate <= sixMonthsForward) {
      // skip weekends
      var dayNr = selectDate.getDay();
      if (dayNr === 5) {
        // Sat
        setSelectedDate(addDays(selectedDate!, 3));
        setMonthDropdownLabel(
          format(new Date(addDays(selectedDate!, 3)), 'MMM yyyy')
        );
      } else if (dayNr === 6) {
        // Sun
        setSelectedDate(addDays(selectedDate!, 2));
        setMonthDropdownLabel(
          format(new Date(addDays(selectedDate!, 2)), 'MMM yyyy')
        );
      } else {
        setSelectedDate(addDays(selectedDate!, 1));
        setMonthDropdownLabel(
          format(new Date(addDays(selectedDate!, 1)), 'MMM yyyy')
        );
      }

      if (holiday.holidays) {
        if (
          selectDate.getFullYear() !==
          new Date(holiday.holidays[0].day).getFullYear()
        ) {
          appDispatch(
            staticDataThunkActions.getHolidays({
              year: selectDate.getFullYear(),
            })
          );
        }
      }
    }
  }, [
    appDispatch,
    holiday.holidays,
    selectedDate,
    setSelectedDate,
    sixMonthsForward,
    threeMonthsBack,
  ]);

  const showOnlineOnly = useCallback(() => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit} />;
      },
    });
  }, [dialog]);

  const subDay = useCallback(() => {
    var selectDate = new Date(selectedDate!);

    if (isSameDay(selectDate, new Date()) && !isOnline) {
      return showOnlineOnly();
    }
    if (selectDate >= threeMonthsBack && selectDate <= sixMonthsForward) {
      // skip weekends
      var dayNr = selectDate.getDay();
      if (dayNr === 0) {
        // Sat
        setSelectedDate(subDays(selectedDate!, 2));
        setMonthDropdownLabel(
          format(new Date(subDays(selectedDate!, 2)), 'MMM yyyy')
        );
      } else if (dayNr === 1) {
        // Sun
        setSelectedDate(subDays(selectedDate!, 3));
        setMonthDropdownLabel(
          format(new Date(subDays(selectedDate!, 3)), 'MMM yyyy')
        );
      } else {
        setSelectedDate(subDays(selectedDate!, 1));
        setMonthDropdownLabel(
          format(new Date(subDays(selectedDate!, 1)), 'MMM yyyy')
        );
      }
    }

    if (holiday.holidays) {
      if (
        selectDate.getFullYear() !==
        new Date(holiday.holidays[0].day).getFullYear()
      ) {
        appDispatch(
          staticDataThunkActions.getHolidays({ year: selectDate.getFullYear() })
        );
      }
    }
  }, [
    appDispatch,
    holiday.holidays,
    isOnline,
    selectedDate,
    setSelectedDate,
    showOnlineOnly,
    sixMonthsForward,
    threeMonthsBack,
  ]);

  const setDayCurrentDate = () => {
    setSelectedDate(new Date());
  };

  // Build new list of months for dropdown, which includes year
  const [newMonthYearList, setNewMonthYearList] = useState<
    DropDownOption<string>[]
  >([]);
  const [monthDropdownLabel, setMonthDropdownLabel] = useState('');

  const onClickTheme = async () => {
    if (isOnline) {
      if (themes.length === 0) {
        await appDispatch(
          programmeThemeThunkActions.getProgrammeThemes({ locale: 'en-za' })
        );
      }

      if (!themeName || themeName === 'No theme') {
        history.push(ROUTES.PROGRAMMES.THEME, {
          classroomGroupId,
          initialDate: selectedDate,
        } as ProgrammeThemeRouteState);
      } else {
        history.push(ROUTES.PROGRAMMES.TIMING, {
          classroomGroupId,
          theme: themes.find((item) => item?.name === theme?.name),
          programmeToEdit: theme,
        } as ProgrammeTimingRouteState);
      }
    } else {
      showOnlineOnly();
    }
  };

  useEffect(() => {
    if (newMonthYearList.length === 0) {
      const datesToAdd: DropDownOption<string>[] = [];
      var selectedDropDownLabel = '';
      if (selectedDate) {
        for (var i = 0; i < 10; i++) {
          var listItem: Date = addMonths(threeMonthsBack, i);
          if (
            format(listItem, 'MMM yyyy') === format(selectedDate, 'MMM yyyy')
          ) {
            selectedDropDownLabel = format(listItem, 'MMM yyyy');
          }
          datesToAdd.push({
            label: format(listItem, 'MMM yyyy'),
            value: i.toString(),
          });
        }
        setNewMonthYearList(datesToAdd);
        setMonthDropdownLabel(selectedDropDownLabel);
      }
    }
  }, [
    newMonthYearList,
    threeMonthsBack,
    selectedDate,
    monthDropdownLabel,
    setNewMonthYearList,
    setMonthDropdownLabel,
  ]);

  const monthYearHandler = useCallback(
    (index: number) => {
      var selectedListValue = newMonthYearList[index];
      var arrListValue = selectedListValue.label.split(' ');
      var year = Number(arrListValue[1]);
      var monthName = arrListValue[0];
      var monthNr = new Date(monthName + '-1-01').getMonth();
      var newDate = new Date(year, monthNr, selectedDate?.getDate());

      setSelectedDate(newDate);

      if (holiday.holidays) {
        if (
          newDate.getFullYear() !==
          new Date(holiday.holidays[0].day).getFullYear()
        ) {
          appDispatch(
            staticDataThunkActions.getHolidays({ year: newDate.getFullYear() })
          );
        }
      }
    },
    [
      appDispatch,
      holiday.holidays,
      newMonthYearList,
      selectedDate,
      setSelectedDate,
    ]
  );

  const setBase64String = async (imageUrl: string) => {
    const response = await axios
      .get(imageUrl, { responseType: 'arraybuffer' })
      .then((response) =>
        new Buffer(response.data, 'binary').toString('base64')
      );
    if (imageUrl.indexOf('.svg') !== -1) {
      setSvgImageBase64('data:image/svg+xml;base64,' + response);
    } else if (
      imageUrl.indexOf('.jpg') !== -1 ||
      imageUrl.indexOf('.jpeg') !== -1
    ) {
      setSvgImageBase64('data:image/jpg;base64,' + response);
    } else {
      setSvgImageBase64('data:image/png;base64,' + response);
    }
  };

  useEffect(() => {
    if (
      chosedTheme &&
      chosedTheme.imageUrl !== undefined &&
      chosedTheme.imageUrl !== ''
    ) {
      setBase64String(chosedTheme.imageUrl);
    }
  }, [chosedTheme]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography type="h2" color="textDark" text={classroomGroup?.name} />
        {!weekSummary && (
          <div className="flex items-center gap-4">
            <Dropdown
              placeholder={`${monthDropdownLabel}`}
              list={newMonthYearList}
              selectedValue={month}
              onChange={(item) => {
                setMonth(item);
                monthYearHandler(Number(item));
              }}
              fillColor="quatenary"
              textColor="white"
              fillType="filled"
              labelColor="white"
              className="w-36"
            />
            <button
              className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full"
              onClick={setDayCurrentDate}
            >
              {renderIcon('CalendarIcon', 'h-5 w-5 text-white')}
            </button>
          </div>
        )}
      </div>
      <div className="border-primaryAccent1 my-4 flex w-full items-center justify-between border-t border-b border-dashed py-4">
        {!weekSummary && (
          <Button
            size="small"
            type="filled"
            color="secondaryAccent2"
            textColor="secondary"
            text="Back"
            icon="ChevronLeftIcon"
            onClick={subDay}
          />
        )}
        <Typography
          type="h3"
          color="textDark"
          text={format(selectedDate ?? new Date(), 'EEE, d MMM yyyy')}
        />
        {!weekSummary && (
          <Button
            size="small"
            type="filled"
            color="secondaryAccent2"
            textColor="secondary"
            text="Next"
            icon="ChevronRightIcon"
            iconPosition="end"
            onClick={addDay}
          />
        )}
      </div>
      <div className={classNames(className, 'flex w-full gap-2')}>
        {!isWeekendDay && showChips && (
          <button
            className={`flex w-full items-center rounded-xl ${themeColour()}`}
            disabled={isWalkthrough || !hasPermissionToEdit}
            onClick={onClickTheme}
          >
            {chosedTheme && (
              <img src={svgImageBase64} alt="theme" className="ml-4 h-8 w-8" />
            )}
            {dailyProgramme && theme?.dailyProgrammes?.length ? (
              <Typography
                type="small"
                color={chosedTheme?.color ? 'white' : 'textDark'}
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
                color={chosedTheme?.color ? 'white' : 'textDark'}
                text={`${themeName}`}
                className={'p-4'}
                weight={`bold`}
              />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
