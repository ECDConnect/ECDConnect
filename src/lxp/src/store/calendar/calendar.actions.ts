import { createAsyncThunk } from '@reduxjs/toolkit';
import { CalendarService } from '@services/CalendarService';
import { RootState, ThunkApiType } from '../types';
import {
  CalendarEventModelInputModel,
  CalendarEventModel,
  CalendarEventTypeDto,
} from '@ecdlink/core';
import { calendarConvert } from './calendar.util';

export const upsertCalendarEvents = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertCalendarEvents',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      calendar: { events },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];

      if (userAuth?.auth_token && !!events && events.length > 0) {
        const service = new CalendarService(userAuth?.auth_token);
        promises = events
          .filter((e) => e.__changed === true)
          .map(async (e) => {
            return await service.syncCalendarEvent(e);
          });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCalendarEventTypes = createAsyncThunk<
  CalendarEventTypeDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { locale: string },
  ThunkApiType<RootState>
>(
  'getCalendarEventTypes',
  // eslint-disable-next-line no-empty-pattern
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      calendar: { eventTypes },
    } = getState();

    if (!eventTypes || eventTypes.length === 0) {
      try {
        let types: CalendarEventTypeDto[] | undefined;

        if (userAuth?.auth_token) {
          types = await new CalendarService(
            userAuth?.auth_token
          ).getCalendarEventTypes(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!types) {
          return rejectWithValue('Error getting calendar event types');
        }

        return types;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return eventTypes;
    }
  }
);

//        const start = subMonths(new Date().getFullYear(), new Date().getMonth(), 0);
export const getCalendarEvents = createAsyncThunk<
  CalendarEventModel[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { start: Date },
  ThunkApiType<RootState>
>(
  'getCalendarEvents',
  // eslint-disable-next-line no-empty-pattern
  async ({ start }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      calendar: { events },
    } = getState();

    if (!events || events.length === 0) {
      try {
        let events: CalendarEventModel[] | undefined;

        if (userAuth?.auth_token) {
          const dtos = await new CalendarService(
            userAuth?.auth_token
          ).getCalendarEvents(start);
          events = calendarConvert.CalendarEventDto.CalendarEventModels(dtos);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!events) {
          return rejectWithValue('Error getting calendar events');
        }

        return events;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return events;
    }
  }
);

export const updateCalendarEvent = createAsyncThunk<
  CalendarEventModelInputModel,
  CalendarEventModelInputModel,
  ThunkApiType<RootState>
>(
  'updateCalendarEvent',
  // eslint-disable-next-line no-empty-pattern
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        input.userId = userAuth.id;
        /*const content =*/ await new CalendarService(
          userAuth?.auth_token
        ).updateCalendarEvent(input, input?.id || '');
        input.__changed = false;
        return input;
      } else {
        return rejectWithValue('no access token');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
