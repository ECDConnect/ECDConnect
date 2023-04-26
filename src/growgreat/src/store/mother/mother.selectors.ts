import { EventRecordType, VisitDataStatus } from '@ecdlink/graphql';
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
      (item) => !item.attended && new Date(item.orderDate) >= new Date()
    ) || [];

  return noAttended.length
    ? noAttended.reduce((prev, curr) =>
        (prev.visitType?.order || 0) < (curr.visitType?.order || 0)
          ? prev
          : curr
      )
    : undefined;
};

export const getMotherLastVisitSelector = (
  state: RootState
): VisitDto | undefined => {
  const visits = state.mothers.visits || [];
  const lastAttended = visits?.filter((item) => item.attended) || [];

  return lastAttended.length
    ? lastAttended.reduce((prev, curr) =>
        (prev.visitType?.order || 0) > (curr.visitType?.order || 0)
          ? prev
          : curr
      )
    : undefined;
};

export const getMotherPreviousVisitSelector = (
  state: RootState,
  currentPlannedVisitDate: string
) => {
  const visits = state.mothers.visits;

  if (!visits) return;

  const filteredVisits = visits.filter((visit) => {
    const plannedVisitDate = new Date(visit.plannedVisitDate);
    return plannedVisitDate < new Date(currentPlannedVisitDate);
  });

  const previousVisit = filteredVisits.reduce(
    (previous: VisitDto | null, current: VisitDto) => {
      const currentPlannedVisitDate = new Date(current.plannedVisitDate);
      if (
        !previous ||
        currentPlannedVisitDate > new Date(previous.plannedVisitDate)
      ) {
        return current;
      }
      return previous;
    },
    null
  );

  return previousVisit;
};

export const getReferralsForMotherSelector = (
  state: RootState
): VisitDataStatus[] | undefined => state.mothers.referralsForMother || [];

export const getCompletedReferralsForMotherSelector = (
  state: RootState
): VisitDataStatus[] | undefined =>
  state.mothers.completedReferralsForMother || [];
