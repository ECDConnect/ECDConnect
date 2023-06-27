import { CalendarEventModel, CalendarEventTypeDto } from '@ecdlink/core';
import { CalendarEventInput } from '@ecdlink/graphql';
import type { EventObject } from '@toast-ui/calendar';

export const calendarConvert = {
  CalendarEventInput: {
    CalendarEventModel: (input: CalendarEventInput): CalendarEventModel => {
      return {
        __changed: false,
        id: input.Id,
        allDay: input.AllDay,
        description: input.Description || '',
        end: input.End,
        eventType: input.EventType || '',
        name: input.Name || '',
        start: input.Start,
        participants: !input.Participants
          ? []
          : input.Participants.map((p) => ({
              id: p?.Id || '',
              participantUserId: p?.ParticipantUserId || '',
            })),
      };
    },
  },

  CalendarEventModel: {
    EventObject: (
      input: CalendarEventModel,
      eventTypes: CalendarEventTypeDto[]
    ): EventObject => {
      return {
        id: input.id,
        calendarId: '1',
        start: new Date(input.start),
        end: new Date(input.end),
        isAllday: input.allDay,
        title: input.name,
        body: input.description,
        category: input.allDay ? 'allday' : 'time',
        color: '#ffffff',
        backgroundColor:
          eventTypes.find((et) => et.name === input.eventType)?.colour ||
          '#1a80b7',
      };
    },

    CalendarEventInput: (input: CalendarEventModel): CalendarEventInput => {
      return {
        AllDay: input.allDay,
        Description: input.description,
        End: input.end,
        EventType: input.eventType,
        Id: input.id,
        IsActive: true,
        Name: input.name,
        Participants: input.participants.map((p) => ({
          CalendarEventId: input.id,
          Id: p.id,
          ParticipantUserId: p.participantUserId,
          IsActive: true,
        })),
        Start: input.start,
      };
    },
  },
};
