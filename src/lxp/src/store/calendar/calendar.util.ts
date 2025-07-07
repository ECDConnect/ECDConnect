import {
  CalendarEventActionModel,
  CalendarEventDto,
  CalendarEventModel,
  CalendarEventModelInputModel,
  CalendarEventTypeDto,
} from '@ecdlink/core';
import { CalendarEventModelInput } from '@ecdlink/graphql';
import type { EventObject } from '@toast-ui/calendar';

export const calendarConvert = {
  CalendarEventModelInputModel: {
    CalendarEventModelInput: (
      input: CalendarEventModelInputModel
    ): CalendarEventModelInput => {
      return {
        action: input.action,
        allDay: input.allDay,
        description: input.description,
        end: input.end,
        eventType: input.eventType,
        id: input.id,
        name: input.name,
        participants: input.participants.map((p) => ({
          id: p.id,
          participantUserId: p.participantUserId,
        })),
        start: input.start,
      };
    },

    CalendarEventModel: (
      input: CalendarEventModelInputModel
    ): CalendarEventModel => {
      return {
        __changed: input.__changed,
        id: input.id || '',
        action: !input.action
          ? null
          : (JSON.parse(input.action) as CalendarEventActionModel),
        allDay: input.allDay,
        description: input.description || '',
        end: input.end as string,
        endTime: input.endTime as string,
        eventType: input.eventType || '',
        name: input.name || '',
        start: input.start as string,
        startTime: input.startTime as string,
        participants: !input.participants
          ? []
          : input.participants.map((p) => ({
              id: p?.id || '',
              participantUserId: p?.participantUserId || '',
              participantUser: {
                firstName: p.participantUser.firstName,
                surname: p.participantUser.surname,
              },
            })),
        userId: input.userId || '',
        user: {
          firstName: input.user.firstName,
          surname: input.user.surname,
        },
        visit: null,
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
        startTime: '',
        end: new Date(input.end),
        endTime: '',
        isAllday: input.allDay,
        title: input.name,
        body: input.description,
        category: input.allDay ? 'allday' : 'time',
        color: 'black',
        borderColor:
          eventTypes.find((et) => et.name === input.eventType)?.colour ||
          'none',
        backgroundColor:
          eventTypes.find((et) => et.name === input.eventType)?.colour ||
          '#1a80b7',
      };
    },

    CalendarEventModelInputModel: (
      input: CalendarEventModel
    ): CalendarEventModelInputModel => {
      return {
        __changed: input.__changed,
        userId: input.userId,
        action: !input.action ? null : JSON.stringify(input.action),
        allDay: input.allDay,
        description: input.description,
        end: input.end,
        endTime: input.endTime,
        eventType: input.eventType,
        id: input.id,
        name: input.name,
        participants: input.participants.map((p) => ({
          id: p.id,
          participantUserId: p.participantUserId,
          participantUser: {
            firstName: p.participantUser.firstName,
            surname: p.participantUser.surname,
          },
        })),
        start: input.start,
        startTime: input.startTime,
        user: {
          firstName: input.user.firstName,
          surname: input.user.surname,
        },
      };
    },

    CalendarEventModelInput: (
      input: CalendarEventModel
    ): CalendarEventModelInput => {
      return {
        action: !!input.action ? JSON.stringify(input.action) : null,
        allDay: input.allDay,
        description: input.description,
        end: input.end,
        eventType: input.eventType,
        id: input.id,
        name: input.name,
        participants: input.participants.map((p) => ({
          id: p.id,
          participantUserId: p.participantUserId,
        })),
        start: input.start,
      };
    },
  },

  CalendarEventDto: {
    CalendarEventModel: (input: CalendarEventDto): CalendarEventModel => {
      return {
        __changed: false,
        id: input.id,
        action: !!input.action ? JSON.parse(input.action) : null,
        allDay: input.allDay,
        description: input.description || '',
        end: input.end,
        endTime: input.endTime || '',
        eventType: input.eventType || '',
        name: input.name || '',
        start: input.start || '',
        startTime: input.startTime || '',
        participants: !input.participants
          ? []
          : input.participants.map((p) => ({
              id: p.id,
              participantUserId: p.participantUserId || '',
              participantUser: {
                firstName: p.participantUser?.firstName || '',
                surname: p.participantUser?.surname || '',
              },
            })),
        userId: input.userId || '',
        user: {
          firstName: input.user?.firstName || '',
          surname: input.user?.surname || '',
        },
        visit: !input.visit
          ? null
          : {
              attended: input.visit.attended,
            },
      };
    },

    CalendarEventModels: (input: CalendarEventDto[]): CalendarEventModel[] => {
      return input.map((i) =>
        calendarConvert.CalendarEventDto.CalendarEventModel(i)
      );
    },
  },
};
