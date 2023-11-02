import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  addNewClub,
  addNewClubLeader,
  addNewClubMembers,
  changeClubName,
  getActivityBeCreativeDetails,
  getActivityMeetRegularDetails,
  getAllClubMembersForCoach,
  getAllClubsDetailsForCoach,
  getAllClubsForCoach,
  getClubForUser,
  moveClubMembers,
  saveWelcomeMessage,
  updateCoachAboutInfo,
} from './club.actions';
import { ClubState, MergedCoachingClub } from './club.types';
import { setThunkActionStatus } from '../utils';
import { setFulfilledThunkActionStatus } from '../utils';

const initialState: ClubState = {
  clubsForCoach: {},
};

const clubSlice = createSlice({
  name: 'club',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Coach
    setThunkActionStatus(builder, getAllClubsForCoach);
    setThunkActionStatus(builder, addNewClub);
    setThunkActionStatus(builder, addNewClubLeader);
    setThunkActionStatus(builder, addNewClubMembers);
    setThunkActionStatus(builder, moveClubMembers);
    setThunkActionStatus(builder, changeClubName);
    setThunkActionStatus(builder, updateCoachAboutInfo);
    setThunkActionStatus(builder, getAllClubsDetailsForCoach);
    setThunkActionStatus(builder, getActivityMeetRegularDetails);
    setThunkActionStatus(builder, getActivityBeCreativeDetails);
    builder.addCase(getActivityBeCreativeDetails.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
      const clubId = action.meta.arg.clubId;

      state.clubsForCoach = {
        ...state.clubsForCoach,
        [clubId]: {
          ...state.clubsForCoach[clubId],
          points: {
            ...state.clubsForCoach[clubId].points,
            beCreative: action.payload,
          },
        },
      };
    });
    builder.addCase(
      getActivityMeetRegularDetails.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);

        const clubId = action.meta.arg.clubId;
        state.clubsForCoach = {
          ...state.clubsForCoach,
          [clubId]: {
            ...state.clubsForCoach[clubId],
            points: {
              ...state.clubsForCoach[clubId].points,
              beCreative: action.payload,
            },
          },
        };
      }
    );
    builder.addCase(getAllClubsForCoach.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      state.clubsForCoach = action.payload.reduce((dictionary, item) => {
        if (!!state.clubsForCoach[item.id]) {
          return {
            ...dictionary,
            [item.id]: {
              ...state.clubsForCoach[item.id],
              club: {
                ...state.clubsForCoach[item.id].club,
                ...item,
              },
            },
          };
        } else {
          return {
            ...dictionary,
            [item.id]: {
              club: item,
            },
          };
        }
      }, {});
      console.log('state.clubsForCoach', state.clubsForCoach);
    });
    // TODO -> Make all these add actions return the new data, so we can add it to state here
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
      state.clubsForCoach = {
        ...state.clubsForCoach,
        [action.payload.id]: {
          ...state.clubsForCoach[action.payload.id],
          name: action.payload.name,
        },
      };

      setFulfilledThunkActionStatus(state, action);
    });
    // TODO: fix types, why is this returning multiple clubs at once???
    builder.addCase(getAllClubMembersForCoach.fulfilled, (state, action) => {
      state.clubsForCoach = Object.keys(state.clubsForCoach).reduce(
        (dictionary, clubId) => {
          const clubMembers = action.payload.find((item) => item.id === clubId);
          if (!!clubMembers) {
            return {
              ...dictionary,
              [clubId]: {
                ...state.clubsForCoach[clubId],
                ...clubMembers,
              },
            };
          } else {
            return {
              ...dictionary,
              [clubId]: { ...state.clubsForCoach[clubId] },
            };
          }
        },
        {}
      );

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getAllClubsDetailsForCoach.fulfilled, (state, action) => {
      state.clubsForCoach = Object.keys(state.clubsForCoach).reduce(
        (dictionary, clubId) => {
          const updatedClub = action.payload.find((item) => item.id === clubId);
          if (!!updatedClub) {
            return {
              ...dictionary,
              [clubId]: {
                ...state.clubsForCoach[clubId],
                club: updatedClub as MergedCoachingClub,
                dateLoaded: new Date(),
              },
            };
          } else {
            return {
              ...dictionary,
              [clubId]: { ...state.clubsForCoach[clubId] },
            };
          }
        },
        {}
      );

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(updateCoachAboutInfo.fulfilled, (state, action) => {
      if (action.payload && action.payload.aboutInfo) {
        state.clubsForCoach = Object.keys(state.clubsForCoach).reduce(
          (dictionary, clubId) => {
            return {
              ...dictionary,
              [clubId]: {
                ...state.clubsForCoach[clubId],
                club: {
                  ...state.clubsForCoach[clubId].club,
                  aboutInfo: action.payload.aboutInfo ?? '',
                },
              },
            };
          },
          {}
        );
      }
      setFulfilledThunkActionStatus(state, action);
    });
    // Practitioner
    setThunkActionStatus(builder, getClubForUser);
    setThunkActionStatus(builder, saveWelcomeMessage);
    builder.addCase(getClubForUser.fulfilled, (state, action) => {
      state.clubForPractitioner = action.payload;

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(saveWelcomeMessage.fulfilled, (state, action) => {
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
