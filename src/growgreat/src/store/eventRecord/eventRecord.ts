import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { addEventRecord } from './eventRecord.actions';
import { EventRecordState } from './eventRecord.types';

const initialState: EventRecordState = {};

const eventRecordSlice = createSlice({
  name: 'eventRecord',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setThunkActionStatus(builder, addEventRecord);
    builder.addCase(addEventRecord.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: eventRecordReducer, actions: eventRecordActions } =
  eventRecordSlice;

const eventRecordPersistConfig = {
  key: 'eventRecord',
  storage: localForage,
  blacklist: [],
};

export { eventRecordPersistConfig, eventRecordReducer, eventRecordActions };
