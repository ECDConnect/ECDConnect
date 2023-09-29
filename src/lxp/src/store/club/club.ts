import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  addNewClub,
  addNewClubLeader,
  addNewClubMembers,
  changeClubName,
  getAllClubsDetailsForCoach,
  getAllClubsForCoach,
  moveClubMembers,
  updateCoachAboutInfo,
} from './club.actions';
import { ClubState, MergedCoachingClub } from './club.types';
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
    setThunkActionStatus(builder, changeClubName);
    setThunkActionStatus(builder, updateCoachAboutInfo);
    setThunkActionStatus(builder, getAllClubsDetailsForCoach);
    builder.addCase(getAllClubsForCoach.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      // Assuming that state.allClubsForCoach and action.payload are arrays of clubs
      const newState = state.allClubsForCoach?.map((clubInState) => {
        // Find the corresponding club in action.payload by ID
        const correspondingClub = action.payload.find(
          (club) => club.id === clubInState.id
        );

        // Merge the state club's data with the corresponding club if it exists
        if (correspondingClub) {
          return { ...clubInState, ...correspondingClub };
        }

        // If there's no match, return the club from the state unchanged
        return clubInState;
      });

      state.allClubsForCoach = newState as MergedCoachingClub[];
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
    builder.addCase(getAllClubsDetailsForCoach.fulfilled, (state, action) => {
      state.allClubsForCoach = state.allClubsForCoach?.map((club) => {
        const updatedClub = action.payload.find((item) => item.id === club.id);
        if (!!updatedClub?.id) {
          return updatedClub as MergedCoachingClub;
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
        } as MergedCoachingClub;
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
