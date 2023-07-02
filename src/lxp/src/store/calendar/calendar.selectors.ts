import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { CalendarEventModel, CalendarEventTypeDto } from '@ecdlink/core';
import type { EventObject } from '@toast-ui/calendar';
import { CalendarState } from './calendar.types';
import { calendarConvert } from './calendar.util';

export const getCalendarEventTypes = (
  state: RootState
): CalendarEventTypeDto[] => state.calendar.eventTypes || [];

export const getCalendarEventTypeColour = (name: string) =>
  createSelector(
    (state: RootState) => state.calendar.eventTypes,
    (
      eventTypes: CalendarEventTypeDto[] | undefined
    ): CalendarEventTypeDto | undefined => {
      if (!eventTypes) return;

      return eventTypes.find((et) => et.name === name);
    }
  );

export const getCalendarEvents = () =>
  createSelector(
    (state: RootState) => state.calendar.events,
    (events: CalendarEventModel[] | undefined): CalendarEventModel[] => {
      if (!events) return [];
      return events;
    }
  );

export const getCalendarEventById = (id: string) =>
  createSelector(
    (state: RootState) => state.calendar.events,
    (events: CalendarEventModel[] | undefined) => {
      if (!events) return undefined;
      return events.find((e) => e.id === id);
    }
  );

export const getCalendarEventObjects = () =>
  createSelector(
    (state: RootState) => state.calendar,
    (calendar: CalendarState) => {
      if (!calendar.events) return [];
      return calendar.events.map((e) => {
        return calendarConvert.CalendarEventModel.EventObject(
          e,
          calendar.eventTypes || []
        );
      });
    }
  );

export const getCalendarEventObjectById = (id: string) =>
  createSelector(
    (state: RootState) => state.calendar,
    (calendar: CalendarState) => {
      if (!calendar.events) return undefined;
      const e = calendar.events.find((e) => e.id === id);
      if (!e) return undefined;
      return calendarConvert.CalendarEventModel.EventObject(
        e,
        calendar.eventTypes || []
      );
    }
  );
