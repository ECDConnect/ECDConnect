import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Dropdown,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import * as styles from './calendar-home.styles';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import { addDays, addWeeks, format, subDays, subWeeks } from 'date-fns';
import {
  CALENDARS,
  DayNameInfo,
  EventInfo,
  SelectDateTimeInfo,
  UpdateEventPopupData,
  VIEW_OPTIONS,
  ViewType,
  WEEK_OPTIONS,
} from './calendar-home.types';
import Calendar from '@toast-ui/react-calendar';
import ToastUIReactCalendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import type { EventObject } from '@toast-ui/calendar';
import UpdateEvent from './components/update-event/update-event';
import { useSelector } from 'react-redux';
import { calendarSelectors } from '@/store/calendar';

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
  const [updateEventPopupData, setUpdateEventPopupData] =
    useState<UpdateEventPopupData>({ visible: false });

  const events = useSelector(calendarSelectors.getCalendarEventObjects());

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
    setUpdateEventPopupData({
      visible: true,
      event: {
        start: start.toISOString(),
        end: end.toISOString(),
        allDay: isAllday,
      },
    });
  };

  const updateEvent = (event: EventObject) => {
    calendarInstance()?.clearGridSelections();
    setUpdateEventPopupData({
      visible: true,
      event: {
        id: event.id as string,
      },
    });
  };

  const onUpdateEventBack = () => {
    calendarInstance()?.clearGridSelections();
    setUpdateEventPopupData({
      visible: false,
    });
  };

  const onUpdateEvent = (IsNew: boolean, eventId: string) => {
    setUpdateEventPopupData({
      visible: false,
    });
    // if (isUpdate) {
    //   const index = events.findIndex((e) => e.id === updatedEvent.id);
    //   if (index >= 0) {
    //     const copy = [...events];
    //     copy[index] = { ...copy[index], ...updatedEvent };
    //     setEvents(copy);
    //   }
    // } else {
    //   const copy = [...events];
    //   copy.push(updatedEvent);
    //   setEvents(copy);
    // }
  };

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
            />
          </div>
        </div>
      </BannerWrapper>
      <Dialog
        fullScreen
        visible={updateEventPopupData.visible}
        position={DialogPosition.Middle}
      >
        <div className={styles.dialogContent}>
          <UpdateEvent
            event={updateEventPopupData.event}
            onBack={() => onUpdateEventBack()}
            onUpdated={(isNew: boolean, eventId: string) =>
              onUpdateEvent(isNew, eventId)
            }
          />
        </div>
      </Dialog>
    </div>
  );
};

export default CalendarHome;
