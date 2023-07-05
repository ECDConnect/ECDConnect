export interface CalendarEventParticipantModel {
  id: string;
  participantUserId: string;
  participantUser: {
    firstName: string;
    surname: string;
  };
}

export interface CalendarEventModel {
  __changed?: boolean;
  id: string;
  allDay: boolean;
  description: string;
  end: string;
  eventType: string;
  name: string;
  start: string;
  participants: CalendarEventParticipantModel[];
  action: any;
  userId: string;
  user: {
    firstName: string;
    surname: string;
  };
}

export interface CalendarEventParticipantModelInputModel {
  id: string;
  participantUserId: string;
  participantUser: {
    firstName: string;
    surname: string;
  };
}

export interface CalendarEventModelInputModel {
  __changed?: boolean;
  id: string;
  allDay: boolean;
  description: string;
  end: string;
  eventType: string;
  name: string;
  start: string;
  participants: CalendarEventParticipantModelInputModel[];
  action: any;
  userId?: string;
  user: {
    firstName: string;
    surname: string;
  };
}
