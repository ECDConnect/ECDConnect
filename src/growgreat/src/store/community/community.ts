import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { ThunkStateStatus } from '../types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

import { CommunityState } from './community.types';
import {
  getAllConnect,
  getAllConnectItem,
  getMoreInformation,
  saveWelcomeMessage,
} from './community.actions';

const initialState: CommunityState & ThunkStateStatus = {
  connect: [],
  connectItem: [],
  team: {
    info: [],
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
    setThunkActionStatus(builder, saveWelcomeMessage);
    setThunkActionStatus(builder, getMoreInformation);
    builder.addCase(getMoreInformation.fulfilled, (state, action) => {
      const tab = action?.meta?.arg?.tab;
      const locale = action?.meta?.arg?.locale;

      if (tab) {
        const tabInfo = state[tab] || { info: [] };
        state[tab] = tabInfo;

        if (!tabInfo.info) {
          tabInfo.info = [];
        }

        const existingLocaleIndex = tabInfo?.info.findIndex((infoItem) =>
          Object.hasOwnProperty.call(infoItem, locale)
        );

        if (existingLocaleIndex !== -1) {
          tabInfo.info[existingLocaleIndex][locale] = {
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
          tabInfo.info.push(newLocaleData);
        }
      }

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(saveWelcomeMessage.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      // TODO: handle fulfilled action, add message to state
    });
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
