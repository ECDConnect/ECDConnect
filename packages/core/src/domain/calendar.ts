export interface CalendarEventParticipantModel {
  id: string;
  participantUserId: string;
  participantUser: {
    firstName: string;
    surname: string;
    type?: 'practitioner' | 'principal' | 'coach' | 'child';
  };
}

export interface CalendarEventActionModel {
  buttonName: string;
  buttonIcon?: string;
  url: string;
  state?: any;
}

export interface CalendarEventModel {
  __changed?: boolean;
  id: string;
  allDay: boolean;
  description: string;
  end: string;
  endTime: string;
  eventType: string;
  name: string;
  start: string;
  startTime: string;
  participants: CalendarEventParticipantModel[];
  action: CalendarEventActionModel | null;
  userId: string;
  user: {
    firstName: string;
    surname: string;
  };
  visit: {
    attended: boolean | null;
  } | null;
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
  endTime: string;
  eventType: string;
  name: string;
  start: string;
  startTime: string;
  participants: CalendarEventParticipantModelInputModel[];
  action: string | null;
  userId?: string;
  user: {
    firstName: string;
    surname: string;
  };
}
