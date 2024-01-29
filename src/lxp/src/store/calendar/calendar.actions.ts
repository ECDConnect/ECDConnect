import { createAsyncThunk } from '@reduxjs/toolkit';
import { CalendarService } from '@services/CalendarService';
import { RootState, ThunkApiType } from '../types';
import {
  CalendarEventModelInputModel,
  CalendarEventModel,
  CalendarEventTypeDto,
} from '@ecdlink/core';
import { calendarConvert } from './calendar.util';

export const CalendarActions = {
  UPDATE_CALENDAR_EVENT: 'updateCalendarEvent',
  CANCEL_CALENDAR_EVENT: 'cancelCalendarEvent',
};

export const upsertCalendarEvents = createAsyncThunk<
  boolean[],
  undefined,
  ThunkApiType<RootState>
>('upsertCalendarEvents', async (_, { getState, rejectWithValue }) => {
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
});

export const getCalendarEventTypes = createAsyncThunk<
  CalendarEventTypeDto[],
  { locale: string },
  ThunkApiType<RootState>
>(
  'getCalendarEventTypes',
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

export const getCalendarEvents = createAsyncThunk<
  CalendarEventModel[],
  { start: Date },
  ThunkApiType<RootState>
>('getCalendarEvents', async ({ start }, { getState, rejectWithValue }) => {
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
});

export const updateCalendarEvent = createAsyncThunk<
  CalendarEventModelInputModel,
  CalendarEventModelInputModel,
  ThunkApiType<RootState>
>(
  CalendarActions.UPDATE_CALENDAR_EVENT,
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

export const cancelCalendarEvent = createAsyncThunk<
  { id: string } | { id: string }[] | undefined,
  { id: string } | undefined,
  ThunkApiType<RootState>
>(
  CalendarActions.CANCEL_CALENDAR_EVENT,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      calendar: { eventIdsToCancel },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          return await new CalendarService(
            userAuth?.auth_token
          ).cancelCalendarEvent(input);
        }

        if (!!eventIdsToCancel?.length) {
          const promises = eventIdsToCancel
            ?.filter((id) => !!id)
            ?.map(async (id) => {
              return await new CalendarService(
                userAuth?.auth_token
              ).cancelCalendarEvent({ id });
            });

          return await Promise.all(promises);
        }
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
