import { CalendarAddEventParticipantFormModel } from '../calendar-add-event/calendar-add-event.types';

export interface CalendarSearchParticipantProps {
  currentParticipantUsers: CalendarAddEventParticipantFormModel[];
  onBack: () => void;
  onDone: (participantUsers: CalendarAddEventParticipantFormModel[]) => void;
}
