import type { EventObject } from '@toast-ui/calendar';
import { UpdateEventEvent } from './components/update-event/update-event.types';

export const CALENDARS = [
  {
    id: '1',
    name: 'Calendar',
  },
];

export const WEEK_OPTIONS = {
  startDayOfWeek: 1,
  workweek: true,
  taskView: [],
};

export const VIEW_OPTIONS = [
  {
    label: 'Day',
    value: 'day',
  },
  {
    label: 'Week',
    value: 'week',
  },
];

export interface DayNameInfo {
  date: string;
}

export interface SelectDateTimeInfo {
  start: Date;
  end: Date;
  isAllday: boolean;
  nativeEvent?: MouseEvent;
  gridSelectionElements: Element[];
}

export interface EventInfo {
  event: EventObject;
  nativeEvent: MouseEvent;
}

export type ViewType = 'day' | 'week' | 'month';

export type UpdateEventPopupData = {
  visible: boolean;
  event?: UpdateEventEvent;
};
