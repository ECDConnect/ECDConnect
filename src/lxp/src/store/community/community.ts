import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

import { CommunityState } from './community.types';
import {
  getAllCommunitySectionItemSS,
  getCommunitySectionSS,
} from './community.actions';

const initialState: CommunityState & ThunkStateStatus = {
  connectSectionData: [],
  connectSectionItemData: [],
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    resetCommunityConnectState: (state) => {
      state.connectSectionData = initialState.connectSectionData;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getCommunitySectionSS);
    setThunkActionStatus(builder, getAllCommunitySectionItemSS);

    builder.addCase(getCommunitySectionSS.fulfilled, (state, action) => {
      state.connectSectionData = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getAllCommunitySectionItemSS.fulfilled, (state, action) => {
      state.connectSectionItemData = action.payload;
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
