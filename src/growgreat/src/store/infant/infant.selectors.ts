import { InfantDto, VisitDto } from '@ecdlink/core';
import { RootState } from '../types';
import { EventRecordType } from '@ecdlink/graphql';

export const getInfants = (state: RootState): InfantDto[] =>
  state.infants.infants || [];

export const getInfantById = (
  state: RootState,
  id: string
): InfantDto | undefined =>
  state.infants.infants?.find((infant) => infant?.user?.id === id);

export const getInfantsWeeklyVisitsSelector = (state: RootState): InfantDto[] =>
  state.infants.infantsWeeklyVisits || [];

export const getInfantCountForMonth = (state: RootState): number =>
  state.infants.infantCountForMonth || 0;

export const getInfantVisitsSelector = (state: RootState): VisitDto[] =>
  state.infants.visits || [];

export const getInfantFirstVisitSelector = (
  state: RootState
): VisitDto | null => {
  const visits = state.infants.visits;

  if (!visits) return null;

  const filteredVisits = visits.filter((visit) => {
    const plannedVisitDate = new Date(visit.plannedVisitDate);
    return plannedVisitDate.getFullYear() !== 0;
  });
  const firstVisit = filteredVisits.reduce(
    (oldest: VisitDto | null, current: VisitDto) => {
      const currentPlannedVisitDate = new Date(current.plannedVisitDate);
      if (
        !oldest ||
        currentPlannedVisitDate < new Date(oldest.plannedVisitDate)
      ) {
        return current;
      }
      return oldest;
    },
    null
  );

  return firstVisit;
};

export const getInfantPreviousVisitSelector = (
  state: RootState,
  currentPlannedVisitDate: string
) => {
  const visits = state.infants.visits;

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

export const getIsInfantFirstVisitSelector = (
  state: RootState,
  currentVisitId: string
): boolean => {
  const firstVisit = getInfantFirstVisitSelector(state);

  return currentVisitId === firstVisit?.id;
};

export const getInfantVisitByVisitIdSelector = (
  state: RootState,
  visitId: string
): VisitDto | undefined =>
  state.infants.visits?.find((item) => item.id === visitId);

export const getInfantCurrentVisitSelector = (
  state: RootState
): VisitDto | undefined => {
  const visits = state.infants.visits || [];
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

export const getAllInfantEventRecordTypesSelector = (
  state: RootState
): EventRecordType[] => state.infants.eventRecordTypes || [];
