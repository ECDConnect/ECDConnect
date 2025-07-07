import { CalendarEventModel } from '@ecdlink/core';
import * as Yup from 'yup';
import { ListDataItem } from '../calendar.types';

export type CalendarAddEventInfo = {
  id?: string;
  eventTypeDisabled?: boolean;
  eventType?:
    | 'Site visit'
    | 'Preschool event'
    | 'Birthday'
    | 'Caregiver meeting'
    | 'Fundraising event'
    | 'Holiday celebration'
    | 'Open day'
    | 'Training'
    | 'Other';
  start?: string;
  startTime?: string;
  end?: string;
  endTime?: string;
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
  guests?: ListDataItem[];
  optionsToHide?: CalendarAddEventInfo['eventType'][];
  eventTypeDisabled?: boolean;
  hideAddParticipantsButton?: boolean;
  onUpdated: (isNew: boolean, event: CalendarEventModel) => void;
  onCancel: () => void;
}

export interface CalendarAddEventParticipantFormModel {
  userId: string;
  firstName: string;
  surname: string;
  userRole: string;
  profileImage: string;
}

export interface CalendarAddEventFormModel {
  name: string;
  start: Date;
  startTime: string;
  end: Date;
  endTime: string;
  allDay: boolean;
  description: string;
  eventType?: string;
  participants: CalendarAddEventParticipantFormModel[];
}

export const defaultCalendarAddEventFormSchema: CalendarAddEventFormModel = {
  name: '',
  start: new Date(),
  startTime: '',
  end: new Date(),
  endTime: '',
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
  guests?: ListDataItem[];
  optionsToHide?: CalendarAddEventInfo['eventType'][];
  onUpdated?: (isNew: boolean, event: CalendarEventModel) => void;
  onCancel?: () => void;
}

export interface CalendarEditEventOptions {
  event: CalendarEditEventInfo;
  eventTypeDisabled?: boolean;
  hideAddParticipantsButton?: boolean;
  onUpdated?: (event: CalendarEventModel) => void;
  onCancel?: () => void;
}
