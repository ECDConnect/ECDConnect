import { CalendarEventModel } from '@ecdlink/core';
import * as Yup from 'yup';
import { EventType, ParticipantType } from '../calendar.types';

export type CalendarAddEventInfo = {
  id?: string;
  eventType?: EventType;
  start?: string;
  end?: string;
  minDate?: string;
  maxDate?: string;
  allDay?: boolean;
  name?: string;
  description?: string;
  participantUserIds?: string[];
  action?: {
    buttonName: string;
    buttonIcon?: string;
    url: string;
    state?: any;
  };
};

export type CalendarEditEventInfo = {
  id: string;
  minDate?: string;
  maxDate?: string;
};

export interface CalendarAddEventProps {
  event?: CalendarAddEventInfo;
  onUpdated: (isNew: boolean, event: CalendarEventModel) => void;
  onCancel: () => void;
}

export interface CalendarAddEventParticipantFormModel {
  userId: string;
  firstName: string;
  surname: string;
  type: ParticipantType;
}

export interface CalendarAddEventFormModel {
  name: string;
  start: Date | undefined;
  end: Date | undefined;
  allDay: boolean;
  description: string;
  eventType?: string;
  participants: CalendarAddEventParticipantFormModel[];
}

export const defaultCalendarAddEventFormSchema: CalendarAddEventFormModel = {
  name: '',
  start: new Date(),
  end: new Date(),
  allDay: false,
  description: '',
  eventType: undefined,
  participants: [],
};

export const CalendarAddEventFormSchema = Yup.object().shape({
  name: Yup.string().required(),
  //body: Yup.string().required(),
  start: Yup.date().required(),
  end: Yup.date().required(),
});

export interface CalendarAddEventOptions {
  event: CalendarAddEventInfo;
  onUpdated?: (isNew: boolean, event: CalendarEventModel) => void;
  onCancel?: () => void;
}

export interface CalendarEditEventOptions {
  event: CalendarEditEventInfo;
  onUpdated?: (event: CalendarEventModel) => void;
  onCancel?: () => void;
}
