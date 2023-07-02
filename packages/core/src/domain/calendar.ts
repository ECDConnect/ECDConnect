export interface CalendarEventParticipantModel {
  id: string;
  participantUserId: string;
}

export interface CalendarEventModel {
  __changed: boolean;
  id: string;
  allDay: boolean;
  description: string;
  end: string;
  eventType: string;
  name: string;
  start: string;
  participants: CalendarEventParticipantModel[];
}
