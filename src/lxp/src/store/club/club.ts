import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  addNewClub,
  addNewClubLeader,
  addNewClubMembers,
  changeClubName,
  getAllClubMembersForCoach,
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

      if (!state.allClubsForCoach) {
        state.allClubsForCoach = [];
      }

      const newState = [...state.allClubsForCoach]; // Create a new array to avoid mutating the original state

      const payloadAsMergedClubs = action.payload as MergedCoachingClub[];

      payloadAsMergedClubs.forEach((newClub) => {
        const existingClubIndex = newState.findIndex(
          (club) => club.id === newClub.id
        );

        if (existingClubIndex !== -1) {
          // If the club already exists in the state, merge the data
          newState[existingClubIndex] = {
            ...newState[existingClubIndex],
            ...newClub,
          };
        } else {
          // If the club doesn't exist in the state, add the new club
          newState.push(newClub);
        }
      });

      state.allClubsForCoach = newState;
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
    builder.addCase(getAllClubMembersForCoach.fulfilled, (state, action) => {
      const updatedClubs = state.allClubsForCoach?.map((club) => {
        const matchingPayload = action.payload.find(
          (payloadItem) => payloadItem.id === club.id
        );

        if (matchingPayload) {
          return {
            ...club,
            ...matchingPayload,
          };
        }

        return club;
      });

      if (updatedClubs) {
        state.allClubsForCoach = updatedClubs;
      }

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
      if (action.payload && action.payload.aboutInfo) {
        state.allClubsForCoach = state.allClubsForCoach?.map((club) => {
          return {
            ...club,
            coach: {
              ...club.coach,
              aboutInfo: action.payload.aboutInfo ?? '',
            },
          } as MergedCoachingClub;
        });
      }
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
