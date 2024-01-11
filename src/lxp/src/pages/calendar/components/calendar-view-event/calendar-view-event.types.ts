import { CalendarEventModel } from '@ecdlink/core';

export interface CalendarViewEventProps {
  canEdit?: boolean;
  event: CalendarEventModel | string;
  actionButton?: CalendarViewEventOptions['actionButton'];
  eventTypeDisabled?: boolean;
  hideAddParticipantsButton?: boolean;
  onClose: () => void;
}

export interface CalendarViewEventOptions {
  canEdit?: boolean;
  event: CalendarEventModel | string;
  eventTypeDisabled?: boolean;
  hideAddParticipantsButton?: boolean;
  actionButton?: {
    name: string;
    icon?: string;
    onClick: () => void;
  };
}
