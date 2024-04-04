import { CalendarEventModel, CalendarEventTypeDto } from '@ecdlink/core';

export type CalendarState = {
  events?: CalendarEventModel[];
  eventTypes?: CalendarEventTypeDto[];
  eventIdsToCancel?: string[];
};
