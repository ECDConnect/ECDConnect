import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  addNewClub,
  addNewClubLeader,
  addNewClubMembers,
  getAllClubsForCoach,
  moveClubMembers,
} from './club.actions';
import { ClubState } from './club.types';
import { setThunkActionStatus } from '../utils';
import { setFulfilledThunkActionStatus } from '../utils';

const initialState: ClubState = {};

const clubSlice = createSlice({
  name: 'club',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getAllClubsForCoach);
    setThunkActionStatus(builder, addNewClub);
    setThunkActionStatus(builder, addNewClubLeader);
    setThunkActionStatus(builder, addNewClubMembers);
    setThunkActionStatus(builder, moveClubMembers);
    builder.addCase(getAllClubsForCoach.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      state.allClubsForCoach = action.payload;
    });
    builder.addCase(addNewClub.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addNewClubLeader.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addNewClubMembers.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(moveClubMembers.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: clubReducer, actions: clubActions } = clubSlice;

const clubPersistConfig = {
  key: 'club',
  storage: localForage,
  blacklist: [],
};

export { clubPersistConfig, clubReducer, clubActions };
