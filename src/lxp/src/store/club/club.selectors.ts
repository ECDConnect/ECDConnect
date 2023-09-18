import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';

export const getAllClubsForCoachSelector = (state: RootState) =>
  state.clubs?.allClubsForCoach;

export const getClubByIdSelector = (clubId: string) =>
  createSelector(
    (state: RootState) => state.clubs?.allClubsForCoach,
    (clubs) => clubs?.find((club) => club.id === clubId)
  );

export const getCurrentClubLeaderByClubIdSelector = (clubId: string) =>
  createSelector(getClubByIdSelector(clubId), (club) =>
    club?.clubLeaders?.find(
      (leader) => !!leader?.isActive && !!leader?.dateAccepted
    )
  );

export const getNextClubLeaderByClubIdSelector = (clubId: string) =>
  createSelector(getClubByIdSelector(clubId), (club) =>
    club?.clubLeaders?.find(
      (leader) => !!leader?.dateAssigned && !leader?.dateAccepted
    )
  );
