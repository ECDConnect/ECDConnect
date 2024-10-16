import { CalendarEventParticipantDto } from './calendar-event-participant.dto';

export interface CalendarEventDto {
  id: string;
  action: string | null;
  allDay: boolean;
  description: string | null;
  end: string;
  endTime: string;
  eventType: string | null;
  isActive: boolean;
  name: string | null;
  participants: CalendarEventParticipantDto[] | null;
  start: string | null;
  startTime: string;
  userId: string | null;
  user: {
    firstName: string | null;
    surname: string | null;
  } | null;
  visit: {
    attended: boolean | null;
  } | null;
}
