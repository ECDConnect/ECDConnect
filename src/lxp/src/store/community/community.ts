import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

import { CommunityState } from './community.types';
import {
  acceptOrRejectCommunityRequests,
  deleteCommunityProfile,
  getAllConnect,
  getAllConnectItem,
  getCommunityProfile,
  saveCommunityProfile,
} from './community.actions';

const initialState: CommunityState & ThunkStateStatus = {
  connect: [],
  connectItem: [],
  communityProfile: undefined,
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
    setThunkActionStatus(builder, getCommunityProfile);

    builder.addCase(getAllConnect.fulfilled, (state, action) => {
      state.connect = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getAllConnectItem.fulfilled, (state, action) => {
      state.connectItem = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getCommunityProfile.fulfilled, (state, action) => {
      state.communityProfile = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(saveCommunityProfile.fulfilled, (state, action) => {
      state.communityProfile = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(deleteCommunityProfile.fulfilled, (state, action) => {
      state.communityProfile = undefined;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      acceptOrRejectCommunityRequests.fulfilled,
      (state, action) => {
        state.communityProfile = action.payload;
        setFulfilledThunkActionStatus(state, action);
      }
    );
  },
});

const { reducer: communityReducer, actions: communityActions } = communitySlice;

const communityPersistConfig = {
  key: 'community',
  storage: localForage,
  blacklist: [],
};

export { communityPersistConfig, communityReducer, communityActions };
