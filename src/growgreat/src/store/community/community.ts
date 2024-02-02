import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

import { CommunityState } from './community.types';
import { getAllConnect, getAllConnectItem } from './community.actions';

const initialState: CommunityState & ThunkStateStatus = {
  connect: [],
  connectItem: [],
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    resetCommunityConnectState: (state) => {
      state.connect = initialState.connect;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getAllConnect);
    setThunkActionStatus(builder, getAllConnectItem);

    builder.addCase(getAllConnect.fulfilled, (state, action) => {
      state.connect = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getAllConnectItem.fulfilled, (state, action) => {
      state.connectItem = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: communityReducer, actions: communityActions } = communitySlice;

const communityPersistConfig = {
  key: 'community',
  storage: localForage,
  blacklist: [],
};

export { communityPersistConfig, communityReducer, communityActions };
