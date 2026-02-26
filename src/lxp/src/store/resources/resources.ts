import { createSlice } from '@reduxjs/toolkit';
import {
  setFulfilledThunkActionStatus,
  setThunkActionStatus,
} from '@/store/utils';
import localforage from 'localforage';
import { ResourcesState } from './resources.types';
import { getResources } from './resources.actions';

const initialState: ResourcesState = {
  businessResources: undefined,
  classroomResources: undefined,
};

const resourcesSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getResources);
    builder.addCase(getResources.fulfilled, (state, action) => {
      if (action.meta.arg.sectionType === 'business') {
        state.businessResources = action.payload;
      } else {
        state.classroomResources = action.payload;
      }
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: resourceReducer, actions: resourceActions } = resourcesSlice;

const resourcesPersistConfig = {
  key: 'resources',
  storage: localforage,
  blacklist: [],
};

export { resourcesPersistConfig, resourceReducer, resourceActions };
