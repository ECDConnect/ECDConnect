import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  cancelCalendarEvent,
  getCalendarEventTypes,
  getCalendarEvents,
  updateCalendarEvent,
  upsertCalendarEvents,
} from './calendar.actions';
import { CalendarState } from './calendar.types';
import { calendarConvert } from './calendar.util';
import { CalendarEventModelInputModel } from '@ecdlink/core';
import {
  getActionName,
  setFulfilledThunkActionStatus,
  setRejectedThunkActionStatus,
  setThunkActionStatus,
} from '../utils';
import { Status, ThunkActionStatuses } from '../types';

const initialState: CalendarState = {
  events: [],
  eventTypes: [],
  eventIdsToCancel: [],
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    cancelCalendarEvent: (state, action: PayloadAction<{ id: string }>) => {
      state.eventIdsToCancel = [
        ...(state.eventIdsToCancel ?? []),
        action.payload.id,
      ];
    },
    resetCalendarState: (state) => {
      state.events = initialState.events || [];
      state.eventTypes = initialState.eventTypes;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, updateCalendarEvent, true);
    setThunkActionStatus(builder, cancelCalendarEvent);
    builder.addCase(cancelCalendarEvent.fulfilled, (state, action) => {
      const input = action?.meta?.arg?.id;

      if (input) {
        state.eventIdsToCancel = state.eventIdsToCancel?.filter(
          (id) => id !== input
        );
      } else {
        state.eventIdsToCancel = [];
      }

      setFulfilledThunkActionStatus(state, action);
    });
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
      setRejectedThunkActionStatus(state, action);

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
