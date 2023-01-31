import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { getHealthCareWorkerVisitStatus } from './visit.actions';
import { VisitState } from './visit.types';

const initialState: VisitState = {
  visitStatus: {},
};

const visitSlice = createSlice({
  name: 'visit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getHealthCareWorkerVisitStatus);
    builder.addCase(
      getHealthCareWorkerVisitStatus.fulfilled,
      (state, action) => {
        state.visitStatus = action.payload;

        setFulfilledThunkActionStatus(state, action);
      }
    );
  },
});

const { reducer: visitReducer, actions: visitActions } = visitSlice;

const visitPersistConfig = {
  key: 'visit',
  storage: localForage,
  blacklist: [],
};

export { visitPersistConfig, visitReducer, visitActions };
