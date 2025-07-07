import {
  BannerWrapper,
  Button,
  Dropdown,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import * as styles from './calendar-home.styles';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { createRef, useEffect, useState } from 'react';
import { addDays, addWeeks, format, subDays, subWeeks } from 'date-fns';
import {
  CALENDARS,
  EventInfo,
  SelectDateTimeInfo,
  VIEW_OPTIONS,
  ViewType,
  WEEK_OPTIONS,
} from './calendar-home.types';
import Calendar from '@toast-ui/react-calendar';
import ToastUIReactCalendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import type { EventObject } from '@toast-ui/calendar';
import { useCalendarAddEvent } from './components/calendar-add-event/calendar-add-event';
import { useSelector } from 'react-redux';
import { calendarSelectors } from '@/store/calendar';
import { CalendarEventModel, RoleSystemNameEnum } from '@ecdlink/core';
import { useCalendarViewEvent } from './components/calendar-view-event/calendar-view-event';
import { userSelectors } from '@/store/user';
import './calendar-home-styles.css';

export const CalendarHome: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  const [calendarDate, setCalendarDate] = useState<Date>(date);
  const [calendarView, setCalendarView] = useState<ViewType>('day');
  const calendarRef = createRef<ToastUIReactCalendar>();
  const [calendarEventsSet, setCalendarEventsSet] = useState<boolean>(false);

  const [selectedEventId, setSelectedEventId] = useState('');

  const events = useSelector(calendarSelectors.getCalendarEventObjects());
  const eventById = useSelector(
    calendarSelectors.getCalendarEventById(selectedEventId)
  );

  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );

  const calendarAddEvent = useCalendarAddEvent();
  const calendarViewEvent = useCalendarViewEvent();

  const backToDashboard = () => {
    history.push('/');
  };

  const isCalendarInstanceValid = () => {
    return (
      calendarRef &&
      calendarRef.current &&
      calendarRef.current.getInstance() !== null
    );
  };

  const calendarInstance = () => {
    return (
      calendarRef && calendarRef.current && calendarRef.current.getInstance()
    );
  };

  const advanceToDate = (newDate: Date) => {
    if (isCalendarInstanceValid()) {
      const changeToDayView = calendarView !== 'day';
      calendarInstance()?.setDate(newDate);
      if (changeToDayView) calendarInstance()?.changeView('day');
      setCalendarDate(newDate);
      if (changeToDayView) setCalendarView('day');
    }
  };

  const advanceToday = () => {
    const newDate = new Date(date);
    advanceToDate(newDate);
  };

  const changeView = (newView: ViewType) => {
    if (isCalendarInstanceValid()) {
      calendarInstance()?.changeView(newView);
      setCalendarView(newView);
    }
  };

  const advanceCurrentPeriod = (value: number) => {
    if (isCalendarInstanceValid()) {
      var newDate = new Date(calendarDate);
      switch (calendarInstance()?.getViewName()) {
        case 'day':
          if (value < 0) newDate = subDays(calendarDate, -value);
          else newDate = addDays(calendarDate, value);
          break;
        case 'week':
          if (value < 0) newDate = subWeeks(calendarDate, -value);
          else newDate = addWeeks(calendarDate, value);
          break;
        default:
          break;
      }
      calendarInstance()?.setDate(newDate);
      setCalendarDate(newDate);
    }
  };

  const addEvent = (start: Date, end: Date, isAllday: boolean) => {
    calendarInstance()?.clearGridSelections();
    calendarAddEvent({
      event: {
        allDay: isAllday,
        start: start.toISOString(),
        end: end.toISOString(),
      },
      optionsToHide: isCoach
        ? [
            'Birthday',
            'Caregiver meeting',
            'Fundraising event',
            'Holiday celebration',
            'Open day',
          ]
        : ['Site visit', 'Preschool event'],
      onCancel: onCalendarAddEventBack,
      onUpdated: onCalendarAddEventUpdate,
    });
  };

  const updateEvent = (event: EventObject) => {
    setSelectedEventId(event.id);
    calendarInstance()?.clearGridSelections();
    calendarViewEvent({
      event: event.id,
      // Added this blocking because this type of event is linked to a club and cannot be changed
      // eventTypeDisabled: isClubMonthlyMeeting,
      // hideAddParticipantsButton: isClubMonthlyMeeting,
      actionButton: undefined,
      // (isClubLeader || isClubSupport) && isClubMonthlyMeeting
      //   ? {
      //       name: 'Record meeting',
      //       icon: 'ArrowCircleRightIcon',
      //       onClick: () => {
      //         history.push(
      //           ROUTES.PRACTITIONER.COMMUNITY.CLUB.MEETING.ADD_MEETING.UPCOMING_MEETING.replace(
      //             ':eventId',
      //             event.id
      //           )
      //         );
      //       },
      //     }
      //   : undefined,
    });
  };

  const onCalendarAddEventBack = () => {
    calendarInstance()?.clearGridSelections();
  };

  const onCalendarAddEventUpdate = (
    IsNew: boolean,
    event: CalendarEventModel
  ) => {};

  useEffect(() => {
    if (!isCalendarInstanceValid() || calendarEventsSet) return;

    calendarInstance()?.on('selectDateTime', (e: SelectDateTimeInfo) => {
      addEvent(e.start, e.end, e.isAllday);
    });

    calendarInstance()?.on('clickEvent', (e: EventInfo) => {
      updateEvent(e.event);
    });

    setCalendarEventsSet(true);

    // calendarInstance()?.on('clickDayName', (e: DayNameInfo) => {
    //   advanceToDate(new Date(e.date));
    // });

    return () => {
      if (!isCalendarInstanceValid()) return;
      if (!calendarEventsSet) return;
      calendarInstance()?.off('selectDateTime');
      calendarInstance()?.off('clickEvent');
      // calendarInstance()?.off('clickDayName');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarRef, calendarRef?.current, calendarRef?.current?.getInstance()]);

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={'Calendar'}
        subTitle={format(calendarDate, 'EEEE, d LLLL yyyy')}
        color={'primary'}
        onBack={() => {
          backToDashboard();
        }}
        displayOffline={!isOnline}
      >
        <div className={styles.wrapper}>
          <div className={styles.calendarTopWrapper}>
            <div className={'ml-4 mr-4 flex flex-row'}>
              <div>
                <Button
                  size="small"
                  type="filled"
                  color="secondaryAccent2"
                  textColor="secondary"
                  text="Back"
                  icon="ChevronLeftIcon"
                  className={'mt-4 mb-4 mr-4 rounded-xl'}
                  onClick={() => {
                    advanceCurrentPeriod(-1);
                  }}
                />
              </div>
              <div>
                <Dropdown<string>
                  list={VIEW_OPTIONS}
                  className={'w-26 mt-3 mb-4'}
                  selectedValue={calendarView}
                  onChange={(item: any) => {
                    changeView(item);
                  }}
                  fillColor="quatenary"
                  textColor="white"
                  fillType="filled"
                  labelColor="white"
                />
              </div>
              <div className="w-full"></div>
              <div>
                <button
                  className="bg-secondary mt-5 mb-4 ml-4 flex h-8 w-8 items-center justify-center rounded-full"
                  onClick={() => {
                    advanceToday();
                  }}
                >
                  {renderIcon('CalendarIcon', 'h-5 w-5 text-white')}
                </button>
              </div>
              <div>
                <Button
                  size="small"
                  type="filled"
                  color="secondaryAccent2"
                  textColor="secondary"
                  text="Next"
                  icon="ChevronRightIcon"
                  iconPosition="end"
                  onClick={() => {
                    advanceCurrentPeriod(1);
                  }}
                  className={'mt-4 mb-4 ml-4 rounded-xl'}
                />
              </div>
              <div
                style={{
                  position: 'fixed',
                  bottom: 0,
                  right: '10px',
                  zIndex: 1000,
                }}
              >
                <Button
                  shape="normal"
                  color="quatenary"
                  type="filled"
                  onClick={() => {
                    addEvent(calendarDate, calendarDate, true);
                  }}
                  className={'mt-4 mb-4 ml-4 rounded-full'}
                >
                  {renderIcon('PlusIcon', 'h-5 w-5 text-white')}
                  <Typography
                    type="h4"
                    color="white"
                    text="Add an event"
                    className="ml-2"
                  />
                </Button>
              </div>
            </div>
          </div>

          <div
            style={{ overflowY: 'scroll', overflowX: 'scroll', margin: '10px' }}
          >
            <Calendar
              ref={calendarRef}
              useFormPopup={false}
              useDetailPopup={false}
              usageStatistics={false}
              view={'day'}
              week={WEEK_OPTIONS}
              events={events}
              calendars={CALENDARS}
              isReadOnly={true}
            />
          </div>
        </div>
      </BannerWrapper>
    </div>
  );
};

export default CalendarHome;
