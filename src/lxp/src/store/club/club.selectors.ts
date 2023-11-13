import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';

// Practitioner
export const getClubForPractitionerSelector = (state: RootState) =>
  state.clubs?.clubForPractitioner;

// Coach
export const getAllClubsForCoachSelector = (state: RootState) =>
  Object.values(state.clubs.clubsForCoach).map((x) => x.club);

export const getClubByIdSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => state.clubs.clubsForCoach,
    (clubs) => clubs[clubId].club
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
    (state: RootState) => state.clubs.clubsForCoach,
    (clubs) => clubs[clubId].points?.meetRegularly
  );

export const getActivityBeCreativeDetailsSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => state.clubs.clubsForCoach,
    (clubs) => clubs[clubId].points?.beCreative
  );
