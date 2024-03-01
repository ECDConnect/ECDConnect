import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

import { CommunityState } from './community.types';
import {
  getAllConnect,
  getAllConnectItem,
  getClinicById,
  getLeagueById,
  getMoreInformation,
  getPointsActivityInfo,
} from './community.actions';

const initialState: CommunityState & ThunkStateStatus = {
  connect: [],
  connectItem: [],
  team: {
    activityInfo: [],
    earnPointsInfo: [],
  },
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
    setThunkActionStatus(builder, getMoreInformation);
    setThunkActionStatus(builder, getLeagueById);
    setThunkActionStatus(builder, getPointsActivityInfo);
    setThunkActionStatus(builder, getClinicById);
    builder.addCase(getClinicById.fulfilled, (state, action) => {
      state.team = state.team ?? {};
      state.team.clinic = action.payload;

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getPointsActivityInfo.fulfilled, (state, action) => {
      const locale = action?.meta?.arg?.locale;
      const activitySlug = action?.meta?.arg?.activitySlug;

      if (!state.team) {
        state.team = { activityInfo: [] };
      }

      if (!state.team.activityInfo) {
        state.team.activityInfo = [];
      }

      // Try to find the existing entry for the activitySlug
      let activityEntryIndex = state.team.activityInfo.findIndex((entry) =>
        Object.keys(entry).includes(activitySlug)
      );

      // If not found, create a new entry
      if (activityEntryIndex === -1) {
        const newActivityEntry = { [activitySlug]: {} };
        state.team.activityInfo.push(newActivityEntry);
        activityEntryIndex = state.team.activityInfo.length - 1; // Update the index to the new entry
      }

      // Update or insert the locale data in the existing entry
      state.team.activityInfo[activityEntryIndex][activitySlug][locale] = {
        dateLoaded: new Date().toISOString(),
        data: action.payload,
      };

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getMoreInformation.fulfilled, (state, action) => {
      const tab = action?.meta?.arg?.tab;
      const locale = action?.meta?.arg?.locale;

      if (tab) {
        const tabInfo = state[tab] || { earnPointsInfo: [] };
        state[tab] = tabInfo;

        if (!tabInfo.earnPointsInfo) {
          tabInfo.earnPointsInfo = [];
        }

        const existingLocaleIndex = tabInfo?.earnPointsInfo.findIndex(
          (infoItem) => Object.hasOwnProperty.call(infoItem, locale)
        );

        if (existingLocaleIndex !== -1) {
          tabInfo.earnPointsInfo[existingLocaleIndex][locale] = {
            dateLoaded: new Date().toISOString(),
            data: action.payload,
          };
        } else {
          const newLocaleData = {
            [locale]: {
              dateLoaded: new Date().toISOString(),
              data: action.payload,
            },
          };
          tabInfo.earnPointsInfo.push(newLocaleData);
        }
      }

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getAllConnect.fulfilled, (state, action) => {
      state.connect = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getAllConnectItem.fulfilled, (state, action) => {
      state.connectItem = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getLeagueById.fulfilled, (state, action) => {
      state.league = action.payload;
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
