import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';

// Practitioner
export const getClubForPractitionerSelector = (state: RootState) =>
  state.clubs?.clubForPractitioner?.club;

export const getLeagueForPractitionerSelector = (state: RootState) =>
  state.clubs?.leagueForPractitioner;

// Coach
export const getAllClubsForCoachSelector = (state: RootState) =>
  Object.values(state.clubs.clubsForCoach).map((x) => x.club);

export const getLeaguesForCoachSelector = (state: RootState) =>
  state.clubs?.leaguesForCoach;

export const getLeagueForCoachSelector = (leagueId: string) =>
  createSelector(
    (state: RootState) => {
      return state.clubs.leaguesForCoach.find((x) => x.id === leagueId);
    },
    (club) => club
  );

// Both
export const getClubByIdSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].club;
      } else {
        return state.clubs.clubForPractitioner?.club;
      }
    },
    (club) => club
  );

//TODO figure out how to set return type for these so we can include undefined
export const getCurrentClubLeaderByClubIdSelector = (clubId: string) =>
  createSelector(getClubByIdSelector(clubId), (club) => club?.clubLeader);

export const getNextClubLeaderByClubIdSelector = (clubId: string) =>
  createSelector(
    getClubByIdSelector(clubId),
    (club) => club?.incomingClubLeader
  );

export const getActivityMeetRegularDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.meetRegularly;
      } else {
        return state.clubs.clubForPractitioner?.points?.meetRegularly;
      }
    },
    (meetRegularly) => meetRegularly
  );

export const getActivityBeCreativeDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.beCreative;
      } else {
        return state.clubs.clubForPractitioner?.points?.beCreative;
      }
    },
    (beCreative) => beCreative
  );

export const getActivityHostFamilyDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.hostFamily;
      } else {
        return state.clubs.clubForPractitioner?.points?.hostFamily;
      }
    },
    (hostFamily) => hostFamily
  );

export const getActivityChildProgressReportsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.childProgressDetails;
      } else {
        return state.clubs.clubForPractitioner?.points?.childProgressDetails;
      }
    },
    (childProgressReports) => childProgressReports
  );

export const getActivityLeaveNoOneBehindDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.leaveNoOneBehind;
      } else {
        return state.clubs.clubForPractitioner?.points?.leaveNoOneBehind;
      }
    },
    (leaveNoOneBehind) => leaveNoOneBehind
  );

export const getActivityChildAttendanceDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => {
      const user = state.user.user;

      const isCoach = user?.roles?.some((role) =>
        role.name.includes(UserTypeEnum.Coach)
      );

      if (isCoach) {
        return state.clubs.clubsForCoach[clubId].points?.childAttendance;
      } else {
        return state.clubs.clubForPractitioner?.points?.childAttendance;
      }
    },
    (childAttendance) => childAttendance
  );
