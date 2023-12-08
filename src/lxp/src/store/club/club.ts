import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  acceptNewClubLeaderRole,
  addBeCreativeActivity,
  addCaregiverReportBackMeeting,
  addClubMeeting,
  addFamilyDayMeeting,
  addNewClub,
  addNewClubLeader,
  addNewClubMembers,
  changeClubName,
  changeClubSupportRole,
  getActivityBeCreativeDetails,
  getActivityHostFamilyDetails,
  getActivityLeaveNoOneBehindDetails,
  getActivityChildProgressDetails,
  getActivityMeetRegularDetails,
  getClubById,
  getClubForUser,
  getClubsForCoach,
  getLeagueForUser,
  getLeaguesForCoach,
  moveClubMembers,
  saveWelcomeMessage,
  updateCoachAboutInfo,
  getActivityChildAttendanceDetails,
  updateClubSupportStatus,
} from './club.actions';
import { ClubState } from './club.types';
import { setThunkActionStatus } from '../utils';
import { setFulfilledThunkActionStatus } from '../utils';
import { ClubDto, DetailClubDto } from '@/models/club/club.dto';
import {
  BeCreativeActivityInput,
  ClubMeetingInput,
  UpdateClubSupportStatusInput,
} from '@/services/ClubService/types';

const initialState: ClubState = {
  clubForPractitioner: {},
  leagueForPractitioner: undefined,
  practitionerLastCaregiverReportBackDate: undefined,
  clubsForCoach: {},
  leaguesForCoach: [],
  dateLeagueDataLoaded: undefined,
  addClubMeetingSyncInputs: [],
  addBeCreativeActivitySyncInputs: [],
  addFamilyDayMeetingSyncInputs: [],
  addCaregiverReportBackMeetingSyncInput: undefined,
};

const clubSlice = createSlice({
  name: 'club',
  initialState,
  reducers: {
    changeClubSupportRole: (
      state,
      action: PayloadAction<ClubDto['clubSupport']>
    ) => {
      if (!state.clubForPractitioner) return;

      state.clubForPractitioner = {
        ...state.clubForPractitioner,
        club: {
          ...state.clubForPractitioner.club,
          clubSupport: action.payload,
        } as DetailClubDto,
      };
    },
    resetClubState: (state) => {
      state.clubsForCoach = initialState.clubsForCoach;
      state.clubForPractitioner = initialState.clubForPractitioner;
      state.addClubMeetingSyncInputs = initialState.addClubMeetingSyncInputs;
      state.addCaregiverReportBackMeetingSyncInput =
        initialState.addCaregiverReportBackMeetingSyncInput;
    },
    addClubMeeting: (state, action: PayloadAction<ClubMeetingInput>) => {
      const newMeeting = action.payload as ClubMeetingInput;
      const existingMeetingIndex = state.addClubMeetingSyncInputs?.findIndex(
        (meeting) => meeting?.meetingDate === newMeeting?.meetingDate
      );

      if (
        state.addClubMeetingSyncInputs &&
        existingMeetingIndex !== undefined &&
        existingMeetingIndex !== -1
      ) {
        state.addClubMeetingSyncInputs[existingMeetingIndex] = newMeeting;
      } else {
        state.addClubMeetingSyncInputs = [
          ...(state.addClubMeetingSyncInputs || []),
          newMeeting,
        ];
      }
    },
    addCaregiverReportBackMeeting: (
      state,
      action: PayloadAction<{ clubId: string; userId: string }>
    ) => {
      state.addCaregiverReportBackMeetingSyncInput = action.payload;
      state.practitionerLastCaregiverReportBackDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() < 7 ? 6 : 11,
      };
    },
    addBeCreativeActivity: (
      state,
      action: PayloadAction<BeCreativeActivityInput>
    ) => {
      const newActivity = action.payload as BeCreativeActivityInput;
      const existingActivityIndex =
        state.addBeCreativeActivitySyncInputs?.findIndex(
          (activity) => activity?.dateUploaded === newActivity?.dateUploaded
        );

      if (
        state.addBeCreativeActivitySyncInputs &&
        existingActivityIndex !== undefined &&
        existingActivityIndex !== -1
      ) {
        state.addBeCreativeActivitySyncInputs[existingActivityIndex] =
          newActivity;
      } else {
        state.addBeCreativeActivitySyncInputs = [
          ...(state.addBeCreativeActivitySyncInputs || []),
          newActivity,
        ];
      }
    },
    addFamilyDayMeeting: (state, action: PayloadAction<ClubMeetingInput>) => {
      const newMeeting = action.payload as ClubMeetingInput;
      const existingMeetingIndex =
        state.addFamilyDayMeetingSyncInputs?.findIndex(
          (meeting) => meeting?.meetingDate === newMeeting?.meetingDate
        );

      if (
        state.addFamilyDayMeetingSyncInputs &&
        existingMeetingIndex !== undefined &&
        existingMeetingIndex !== -1
      ) {
        state.addFamilyDayMeetingSyncInputs[existingMeetingIndex] = newMeeting;
      } else {
        state.addFamilyDayMeetingSyncInputs = [
          ...(state.addFamilyDayMeetingSyncInputs || []),
          newMeeting,
        ];
      }
    },
    updateClubSupportStatus: (
      state,
      action: PayloadAction<UpdateClubSupportStatusInput>
    ) => {
      const { practitionerId } = action.payload;
      const clubId = state.clubForPractitioner?.club?.id;

      if (!clubId || !practitionerId) return;

      state.clubForPractitioner = {
        ...state.clubForPractitioner,
        club: {
          ...state.clubForPractitioner.club,
          clubSupport: {
            ...state?.clubForPractitioner?.club?.clubSupport,
            isNewInSupportRole: false,
          },
        } as DetailClubDto,
      };
    },
  },
  extraReducers: (builder) => {
    // Coach
    setThunkActionStatus(builder, getClubById);
    setThunkActionStatus(builder, getClubsForCoach);
    setThunkActionStatus(builder, getLeaguesForCoach);
    setThunkActionStatus(builder, addNewClub);
    setThunkActionStatus(builder, addNewClubLeader);
    setThunkActionStatus(builder, moveClubMembers);
    setThunkActionStatus(builder, changeClubName);
    setThunkActionStatus(builder, updateCoachAboutInfo);
    setThunkActionStatus(builder, getActivityMeetRegularDetails);
    setThunkActionStatus(builder, getActivityBeCreativeDetails);
    setThunkActionStatus(builder, getActivityHostFamilyDetails);
    setThunkActionStatus(builder, getActivityLeaveNoOneBehindDetails);
    setThunkActionStatus(builder, getActivityChildProgressDetails);
    setThunkActionStatus(builder, getActivityChildAttendanceDetails);
    builder.addCase(
      getActivityChildAttendanceDetails.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);
        const clubId = action.meta.arg.clubId;

        const isCoach = !!state.clubsForCoach[clubId]?.club;

        if (isCoach) {
          state.clubsForCoach = {
            ...state.clubsForCoach,
            [clubId]: {
              ...state.clubsForCoach[clubId],
              points: {
                ...state.clubsForCoach[clubId]?.points,
                childAttendance: action.payload,
              },
            },
          };
        } else {
          state.clubForPractitioner = {
            ...state.clubForPractitioner,
            points: {
              ...state.clubForPractitioner?.points,
              childAttendance: action.payload,
            },
          };
        }
      }
    );
    builder.addCase(
      getActivityLeaveNoOneBehindDetails.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);
        const clubId = action.meta.arg.clubId;

        const isCoach = !!state.clubsForCoach[clubId]?.club;

        if (isCoach) {
          state.clubsForCoach = {
            ...state.clubsForCoach,
            [clubId]: {
              ...state.clubsForCoach[clubId],
              points: {
                ...state.clubsForCoach[clubId]?.points,
                leaveNoOneBehind: action.payload,
              },
            },
          };
        } else {
          state.clubForPractitioner = {
            ...state.clubForPractitioner,
            points: {
              ...state.clubForPractitioner?.points,
              leaveNoOneBehind: action.payload,
            },
          };
        }
      }
    );
    builder.addCase(getActivityHostFamilyDetails.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
      const clubId = action.meta.arg.clubId;

      const isCoach = !!state.clubsForCoach[clubId]?.club;

      if (isCoach) {
        state.clubsForCoach = {
          ...state.clubsForCoach,
          [clubId]: {
            ...state.clubsForCoach[clubId],
            points: {
              ...state.clubsForCoach[clubId]?.points,
              hostFamily: action.payload,
            },
          },
        };
      } else {
        state.clubForPractitioner = {
          ...state.clubForPractitioner,
          points: {
            ...state.clubForPractitioner?.points,
            hostFamily: action.payload,
          },
        };
      }
    });
    builder.addCase(getActivityBeCreativeDetails.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
      const clubId = action.meta.arg.clubId;

      const isCoach = !!state.clubsForCoach[clubId]?.club;

      if (isCoach) {
        state.clubsForCoach = {
          ...state.clubsForCoach,
          [clubId]: {
            ...state.clubsForCoach[clubId],
            points: {
              ...state.clubsForCoach[clubId]?.points,
              beCreative: action.payload,
            },
          },
        };
      } else {
        state.clubForPractitioner = {
          ...state.clubForPractitioner,
          points: {
            ...state.clubForPractitioner?.points,
            beCreative: action.payload,
          },
        };
      }
    });
    builder.addCase(
      getActivityMeetRegularDetails.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);

        const clubId = action.meta.arg.clubId;

        const isCoach = !!state.clubsForCoach[clubId]?.club;

        if (isCoach) {
          state.clubsForCoach = {
            ...state.clubsForCoach,
            [clubId]: {
              ...state.clubsForCoach[clubId],
              points: {
                ...state.clubsForCoach[clubId]?.points,
                meetRegularly: action.payload,
              },
            },
          };
        } else {
          state.clubForPractitioner = {
            ...state.clubForPractitioner,
            points: {
              ...state.clubForPractitioner?.points,
              meetRegularly: action.payload,
            },
          };
        }
      }
    );
    builder.addCase(
      getActivityChildProgressDetails.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);

        const clubId = action.meta.arg.clubId;

        const isCoach = !!state.clubsForCoach[clubId]?.club;

        if (isCoach) {
          state.clubsForCoach = {
            ...state.clubsForCoach,
            [clubId]: {
              ...state.clubsForCoach[clubId],
              points: {
                ...state.clubsForCoach[clubId]?.points,
                childProgressDetails: action.payload,
              },
            },
          };
        } else {
          state.clubForPractitioner = {
            ...state.clubForPractitioner,
            points: {
              ...state.clubForPractitioner?.points,
              childProgressDetails: action.payload,
            },
          };
        }
      }
    );
    builder.addCase(getClubsForCoach.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      state.clubsForCoach = action.payload.reduce((dictionary, item) => {
        if (!!state.clubsForCoach[item.id]) {
          return {
            ...dictionary,
            [item.id]: {
              ...state.clubsForCoach[item.id],
              club: item,
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
    });
    builder.addCase(getClubById.fulfilled, (state, action) => {
      if (!!action.payload) {
        state.clubsForCoach = {
          ...state.clubsForCoach,
          [action.payload.id]: {
            ...state.clubsForCoach[action.payload.id],
            club: action.payload,
          },
        };
      }
      setFulfilledThunkActionStatus(state, action);
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
                  clubCoach: {
                    ...state.clubsForCoach[clubId].club.clubCoach,
                    aboutInfo: action.payload.aboutInfo ?? '',
                  },
                },
              },
            };
          },
          {}
        );
      }
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getLeaguesForCoach.fulfilled, (state, action) => {
      state.leaguesForCoach = action.payload;
      state.dateLeagueDataLoaded = new Date().toISOString();

      setFulfilledThunkActionStatus(state, action);
    });
    // Practitioner
    setThunkActionStatus(builder, addCaregiverReportBackMeeting);
    setThunkActionStatus(builder, acceptNewClubLeaderRole);
    setThunkActionStatus(builder, getClubForUser);
    setThunkActionStatus(builder, getLeagueForUser);
    setThunkActionStatus(builder, saveWelcomeMessage);
    setThunkActionStatus(builder, changeClubSupportRole);
    setThunkActionStatus(builder, addClubMeeting);
    setThunkActionStatus(builder, addBeCreativeActivity);
    setThunkActionStatus(builder, addFamilyDayMeeting);
    setThunkActionStatus(builder, updateClubSupportStatus);
    builder.addCase(updateClubSupportStatus.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addCaregiverReportBackMeeting.fulfilled, (state) => {
      state.addCaregiverReportBackMeetingSyncInput = undefined;
      state.practitionerLastCaregiverReportBackDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() < 7 ? 6 : 11,
      };
    });
    builder.addCase(addFamilyDayMeeting.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      const meta = action.meta.arg as ClubMeetingInput;
      const meetingDate = meta?.meetingDate;

      if (meetingDate) {
        state.addFamilyDayMeetingSyncInputs =
          state.addFamilyDayMeetingSyncInputs?.filter(
            (meeting) => meeting?.meetingDate !== meetingDate
          );
        return;
      }
      // clear all meetings (sync)
      state.addFamilyDayMeetingSyncInputs = [];
    });
    builder.addCase(addBeCreativeActivity.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      const meta = action.meta.arg as BeCreativeActivityInput;
      const dateUploaded = meta?.dateUploaded;

      if (dateUploaded) {
        state.addBeCreativeActivitySyncInputs =
          state.addBeCreativeActivitySyncInputs?.filter(
            (activity) => activity?.dateUploaded !== dateUploaded
          );
        return;
      }
      // clear all activities (sync)
      state.addBeCreativeActivitySyncInputs = [];
    });
    builder.addCase(addClubMeeting.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      const meta = action.meta.arg as ClubMeetingInput;
      const meetingDate = meta?.meetingDate;

      if (meetingDate) {
        state.addClubMeetingSyncInputs = state.addClubMeetingSyncInputs?.filter(
          (meeting) => meeting?.meetingDate !== meetingDate
        );
        return;
      }
      // clear all meetings (sync)
      state.addClubMeetingSyncInputs = [];
    });
    builder.addCase(getClubForUser.fulfilled, (state, action) => {
      if (!action.payload) return;

      state.clubForPractitioner = {
        ...state.clubForPractitioner,
        dateLoaded: new Date().toLocaleDateString(),
        club: {
          ...action.payload,
          clubSupport: {
            ...action.payload.clubSupport,
            isNewInSupportRole:
              state.clubForPractitioner?.club?.clubSupport
                .isNewInSupportRole !== undefined
                ? state.clubForPractitioner?.club?.clubSupport
                    .isNewInSupportRole
                : action.payload?.clubSupport?.isNewInSupportRole,
          },
        },
      };

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getLeagueForUser.fulfilled, (state, action) => {
      state.leagueForPractitioner = action.payload;
      state.dateLeagueDataLoaded = new Date().toISOString();
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(saveWelcomeMessage.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      const practitionerId = action.meta.arg.practitionerId;
      const welcomeMessage = action.meta.arg.welcomeMessage || '';
      const shareContactInfo = action.meta.arg.shareContactInfo;

      if (state.clubForPractitioner?.club) {
        state.clubForPractitioner.club.id =
          state.clubForPractitioner.club.id || '';

        state.clubForPractitioner.club.clubMembers = state.clubForPractitioner
          .club.clubMembers
          ? state.clubForPractitioner.club.clubMembers.map((member) => {
              if (member.practitionerId === practitionerId) {
                return {
                  ...member,
                  welcomeMessage,
                  shareContactInfo,
                };
              } else {
                return member;
              }
            })
          : [];
      }
    });
    builder.addCase(acceptNewClubLeaderRole.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(changeClubSupportRole.fulfilled, (state, action) => {
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
