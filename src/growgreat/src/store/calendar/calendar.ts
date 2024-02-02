import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getCalendarEventTypes,
  getCalendarEvents,
  updateCalendarEvent,
  upsertCalendarEvents,
} from './calendar.actions';
import { CalendarState } from './calendar.types';
import { calendarConvert } from './calendar.util';
import { CalendarEventModelInputModel } from '@ecdlink/core';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: CalendarState = {
  events: [],
  eventTypes: [],
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    resetCalendarState: (state) => {
      state.events = initialState.events || [];
      // state.eventTypes = initialState.eventTypes;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, updateCalendarEvent, true);
    builder.addCase(getCalendarEventTypes.fulfilled, (state, action) => {
      state.eventTypes = action.payload;
    });

    builder.addCase(getCalendarEvents.fulfilled, (state, action) => {
      state.events = action.payload;
    });

    builder.addCase(updateCalendarEvent.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      if (!state.events) {
        state.events = [];
      }

      const event =
        calendarConvert.CalendarEventModelInputModel.CalendarEventModel(
          action.payload
        );
      if (event.__changed === undefined) event.__changed = true;

      const index = state.events.findIndex((e) => e.id === event.id);
      if (index < 0) {
        state.events.push(event);
        return;
      }
      state.events[index] = event;
    });

    builder.addCase(updateCalendarEvent.rejected, (state, action) => {
      if (!state.events) {
        state.events = [];
      }
      if (
        action.payload === 'no access token' ||
        !action.meta ||
        !action.meta.arg ||
        !action.meta.arg.userId
      )
        return;

      const inputModel = action.meta.arg as CalendarEventModelInputModel;
      const event =
        calendarConvert.CalendarEventModelInputModel.CalendarEventModel(
          inputModel
        );
      event.__changed = true;

      const index = state.events.findIndex((e) => e.id === event.id);
      if (index < 0) {
        state.events.push(event);
        return;
      }
      state.events[index] = event;
    });

    builder.addCase(upsertCalendarEvents.fulfilled, (state, action) => {
      if (!state.events) {
        state.events = [];
      }
    });
  },
});

const { reducer: calendarReducer, actions: calendarActions } = calendarSlice;

const calendarPersistConfig = {
  key: 'calendar',
  storage: localForage,
  blacklist: [],
};

export { calendarPersistConfig, calendarReducer, calendarActions };
