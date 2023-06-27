import { createAsyncThunk } from '@reduxjs/toolkit';
import { CalendarService } from '@services/CalendarService';
import { RootState, ThunkApiType } from '../types';
import { CalendarEventModel, CalendarEventTypeDto } from '@ecdlink/core';
import { CalendarEvent, CalendarEventInput } from '@ecdlink/graphql';
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
        const content = await new CalendarService(
          userAuth?.auth_token
        ).updateCalendarEvent(input, input?.Id || '');

        return calendarConvert.CalendarEventInput.CalendarEventModel(input);
      } else {
        return rejectWithValue('no access token');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
