import { createAsyncThunk } from '@reduxjs/toolkit';
import { CalendarService } from '@services/CalendarService';
import { RootState, ThunkApiType } from '../types';
import { CalendarEventModel, CalendarEventTypeDto } from '@ecdlink/core';
import { CalendarEventInput } from '@ecdlink/graphql';
import { calendarConvert } from './calendar.util';

export const upsertCalendar = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertCalendar',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { userLocalePreference },
      calendar: { events },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];

      // if (userAuth?.auth_token && unsyncedChildProgressReportsIds) {
      //   promises = unsyncedChildProgressReportsIds.map(async (x) => {
      //     const currentReportCopy = childProgressionReports?.find(
      //       (z) => z.id === x.reportId
      //     );
      //     if (!currentReportCopy) return Promise.resolve<boolean>(true);

      //     const childProgressReportInput: ChildProgressReportInput = {
      //       ChildId: currentReportCopy?.childId,
      //       ClassroomGroupId: x.classroomGroupId,
      //       Id: currentReportCopy?.id,
      //       ReportDate: currentReportCopy?.reportingDate,
      //       ReportContent: JSON.stringify(currentReportCopy),
      //       IsActive: true,
      //     };

      //     // return await new ContentReportService(
      //     //   userAuth?.auth_token,
      //     //   userLocalePreference
      //     // ).syncChildProgressReport(childProgressReportInput);
      //   });
      // }
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
  CalendarEventModel,
  CalendarEventInput,
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
        /*const content =*/ await new CalendarService(
          userAuth?.auth_token
        ).updateCalendarEvent(input, input?.Id || '');

        const model =
          calendarConvert.CalendarEventInput.CalendarEventModel(input);
        model.__changed = false;
        return model;
      } else {
        return rejectWithValue('no access token');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
