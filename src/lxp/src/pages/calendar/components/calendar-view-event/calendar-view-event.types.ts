import { CalendarEventModel } from '@ecdlink/core';

export interface CalendarViewEventProps {
  canEdit?: boolean;
  event: CalendarEventModel | string;
  onClose: () => void;
}

export interface CalendarViewEventOptions {
  canEdit?: boolean;
  event: CalendarEventModel | string;
}
