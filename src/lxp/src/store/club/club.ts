import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  addNewClub,
  addNewClubLeader,
  addNewClubMembers,
  changeClubName,
  getAllClubsForCoach,
  moveClubMembers,
  updateCoachAboutInfo,
} from './club.actions';
import { ClubState } from './club.types';
import { setThunkActionStatus } from '../utils';
import { setFulfilledThunkActionStatus } from '../utils';
import { CoachingClub } from '@ecdlink/graphql';

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
    setThunkActionStatus(builder, changeClubName);
    setThunkActionStatus(builder, updateCoachAboutInfo);
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
    builder.addCase(changeClubName.fulfilled, (state, action) => {
      state.allClubsForCoach = state.allClubsForCoach?.map((club) => {
        if (club.id === action.payload.id) {
          return {
            ...club,
            name: action.payload.name,
          };
        }
        return club;
      });
      setFulfilledThunkActionStatus(state, action);
    });

    builder.addCase(updateCoachAboutInfo.fulfilled, (state, action) => {
      state.allClubsForCoach = state.allClubsForCoach?.map((club) => {
        return {
          ...club,
          coach: {
            ...club.coach,
            aboutInfo: action.payload.aboutInfo ?? '',
          },
        } as CoachingClub;
      });
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
