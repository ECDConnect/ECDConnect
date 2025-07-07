import { CalendarAddEventParticipantFormModel } from '../calendar-add-event/calendar-add-event.types';
import { ListDataItem } from '../calendar.types';

export interface CalendarSearchParticipantProps {
  customList?: ListDataItem[];
  currentParticipantUsers: CalendarAddEventParticipantFormModel[];
  onBack: () => void;
  onDone: (participantUsers: CalendarAddEventParticipantFormModel[]) => void;
}
