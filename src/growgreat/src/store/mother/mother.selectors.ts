import { EventRecordType } from '@ecdlink/graphql';
import { MotherDto, VisitDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getMothers = (state: RootState): MotherDto[] =>
  state.mothers.mothers || [];

export const getMothersWeeklyVisitsSelector = (state: RootState): MotherDto[] =>
  state.mothers.mothersWeeklyVisits || [];

export const getMotherById = (
  state: RootState,
  id: string
): MotherDto | undefined =>
  state.mothers.mothers?.find((mother) => mother?.user?.id === id);

export const getAllMotherEventRecordTypes = (
  state: RootState
): EventRecordType[] => state.mothers.eventRecordTypes || [];

export const getMotherCountForMonth = (state: RootState): number =>
  state.mothers.motherCountForMonth || 0;

export const getMotherVisits = (state: RootState): VisitDto[] =>
  state.mothers.visits || [];

export const getMotherCurrentVisitSelector = (
  state: RootState
): VisitDto | undefined => {
  const visits = state.mothers.visits || [];
  const noAttended =
    visits?.filter(
      (item) => !item.attended && new Date(item.plannedVisitDate) >= new Date()
    ) || [];

  return noAttended.length
    ? noAttended.reduce((prev, curr) =>
        (prev.visitType?.order || 0) < (curr.visitType?.order || 0)
          ? prev
          : curr
      )
    : undefined;
};
