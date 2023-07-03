import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getCalendarEventTypes,
  getCalendarEvents,
  updateCalendarEvent,
} from './calendar.actions';
import { CalendarState } from './calendar.types';

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
      state.eventTypes = initialState.eventTypes;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCalendarEventTypes.fulfilled, (state, action) => {
      state.eventTypes = action.payload;
    });

    builder.addCase(getCalendarEvents.fulfilled, (state, action) => {
      state.events = action.payload;
    });

    builder.addCase(updateCalendarEvent.fulfilled, (state, action) => {
      if (!state.events) {
        state.events = [];
      }

      const event = action.payload;
      event.__changed = true;

      const index = state.events.findIndex((e) => e.id === event.id);

      if (index < 0) {
        state.events.push(event);
        return;
      }

      state.events[index] = event;
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
