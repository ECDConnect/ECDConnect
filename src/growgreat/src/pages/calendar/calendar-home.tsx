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
import { CalendarEventModel, useTheme } from '@ecdlink/core';
import { useCalendarViewEvent } from './components/calendar-view-event/calendar-view-event';

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
  const theme = useTheme();
  const calendarRef = createRef<ToastUIReactCalendar>();

  const events = useSelector(calendarSelectors.getCalendarEventObjects());

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
    if (!isAllday && end.getTime() - start.getTime() < 3600000) {
      end.setTime(start.getTime() + 3600000);
    }
    calendarAddEvent({
      event: {
        allDay: isAllday,
        start: start.toISOString(),
        end: end.toISOString(),
      },
      onCancel: onCalendarAddEventBack,
      onUpdated: onCalendarAddEventUpdate,
    });
  };

  const updateEvent = (event: EventObject) => {
    calendarInstance()?.clearGridSelections();
    calendarViewEvent({
      event: event.id,
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
    if (!isCalendarInstanceValid()) return;

    calendarInstance()?.on('selectDateTime', (e: SelectDateTimeInfo) => {
      addEvent(e.start, e.end, e.isAllday);
    });

    calendarInstance()?.on('clickEvent', (e: EventInfo) => {
      updateEvent(e.event);
    });

    // calendarInstance()?.on('clickDayName', (e: DayNameInfo) => {
    //   advanceToDate(new Date(e.date));
    // });

    return () => {
      if (!isCalendarInstanceValid()) return;
      calendarInstance()?.off('selectDateTime');
      calendarInstance()?.off('clickEvent');
      // calendarInstance()?.off('clickDayName');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  shape="normal"
                  color="primary"
                  type="filled"
                  onClick={() => {
                    advanceCurrentPeriod(-1);
                  }}
                  className={'mt-4 mb-4 mr-4 rounded-xl'}
                >
                  {renderIcon('ChevronLeftIcon', 'h-5 w-5 text-white')}
                </Button>
              </div>
              {/* <div>
                <Typography
                  type='h3'
                  text='June'
                  className='mt-6 mb-4'
                />
              </div> */}
              <div>
                <Dropdown<string>
                  list={VIEW_OPTIONS}
                  className={'mt-3 mb-4'}
                  textColor="textDark"
                  selectedValue={calendarView}
                  onChange={(item: any) => {
                    changeView(item);
                  }}
                />
              </div>
              <div>
                <Button
                  shape="normal"
                  color="primary"
                  type="filled"
                  onClick={() => {
                    advanceToday();
                  }}
                  className={'mt-4 mb-4 ml-4 rounded-xl'}
                >
                  {renderIcon('CalendarIcon', 'h-5 w-5 text-white')}
                </Button>
              </div>
              <div>
                <Button
                  shape="normal"
                  color="primary"
                  type="filled"
                  onClick={() => {
                    advanceCurrentPeriod(1);
                  }}
                  className={'mt-4 mb-4 ml-4 rounded-xl'}
                >
                  {renderIcon('ChevronRightIcon', 'h-5 w-5 text-white')}
                </Button>
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
                  color="primary"
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
          <div className={styles.calendarWrapper}>
            <Calendar
              ref={calendarRef}
              useFormPopup={false}
              useDetailPopup={false}
              usageStatistics={false}
              view={'day'}
              week={WEEK_OPTIONS}
              template={
                {
                  // milestone: (event: any) => { return (<span>hello</span>)},
                  // milestoneTitle: () => { return (<span>title</span>)}
                }
              }
              events={events}
              calendars={CALENDARS}
              theme={{
                common: {
                  backgroundColor: 'white',
                  today: 'white',
                },
              }}
            />
          </div>
        </div>
      </BannerWrapper>
    </div>
  );
};

export default CalendarHome;
