import { InfantDto, VisitDto } from '@ecdlink/core';
import { RootState } from '../types';
import { EventRecordType, VisitDataStatus } from '@ecdlink/graphql';

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
    const orderDate = new Date(visit.orderDate);
    return orderDate.getFullYear() !== 0;
  });
  const firstVisit = filteredVisits.reduce(
    (oldest: VisitDto | null, current: VisitDto) => {
      const currentPlannedVisitDate = new Date(current.orderDate);
      if (!oldest || currentPlannedVisitDate < new Date(oldest.orderDate)) {
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
  currentOrderVisitDate: string
) => {
  const visits = state.infants.visits;

  if (!visits) return;

  const filteredVisits = visits.filter((visit) => {
    const orderDate = new Date(visit.orderDate);
    return (
      orderDate < new Date(currentOrderVisitDate) &&
      visit.visitType?.name !== 'additional_visit'
    );
  });

  const previousVisit = filteredVisits.reduce(
    (previous: VisitDto | null, current: VisitDto) => {
      const currentPlannedVisitDate = new Date(current.orderDate);
      if (!previous || currentPlannedVisitDate > new Date(previous.orderDate)) {
        return current;
      }
      return previous;
    },
    null
  );

  return previousVisit;
};

export const getIsInfantFirstVisitSelector = (state: RootState): boolean => {
  const visits = state.infants.visits;
  const attendedVisits = visits?.filter(
    (item) => item.visitType?.name !== 'additional_visit' && !!item.attended
  );

  return attendedVisits?.length === 0;
};

export const getIsInfantSecondVisitSelector = (state: RootState): boolean => {
  const visits = state.infants.visits;

  const attendedVisits = visits?.filter(
    (item) => item.visitType?.name !== 'additional_visit' && !!item.attended
  );

  return attendedVisits?.length === 1;
};

export const getInfantVisitByVisitIdSelector = (
  state: RootState,
  visitId: string
): VisitDto | undefined =>
  state.infants.visits?.find((item) => item.id === visitId);

export const getAllInfantEventRecordTypesSelector = (
  state: RootState
): EventRecordType[] => state.infants.eventRecordTypes || [];

export const getReferralsForInfantSelector = (
  state: RootState
): VisitDataStatus[] | undefined => state.infants.referralsForInfant || [];

export const getCompletedReferralsForInfantSelector = (
  state: RootState
): VisitDataStatus[] | undefined =>
  state.infants.completedReferralsForInfant || [];

export const getInfantCurrentVisitSelector = (
  state: RootState,
  visitId: string
): VisitDto | undefined => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allVisits =
    state.infants.visits?.filter(
      (item) => item.visitType?.name !== 'additional_visits'
    ) || [];

  // Priority 1: if a visit id is available, then return visit for id
  if (visitId && visitId !== '') {
    const visits = state.infants.visits || [];
    for (var i = 0; i < visits.length; i++) {
      if (visits[i].id === visitId) {
        return visits[i];
      }
    }
  } else {
    // Priority 2: if there is a visit in progress, we grab the first one
    const inProgressList =
      allVisits?.filter((item) => item.visitInProgress) || [];
    if (inProgressList.length !== 0) {
      return inProgressList[0];
    }

    // Priority 3: grab the latest uncompleted visit from the list
    const noAttended =
      allVisits?.filter(
        (item) => !item.attended && new Date(item.orderDate) >= today
      ) || [];
    if (noAttended) {
      if (noAttended.length !== 0) {
        return noAttended[0];
      }
    } else {
      // Priority 4: grab the latest completed visit from the list
      const lastAttended = allVisits?.filter((item) => item.attended) || [];
      return lastAttended.length
        ? lastAttended.reduce((prev, curr) =>
            (prev.visitType?.order || 0) > (curr.visitType?.order || 0)
              ? prev
              : curr
          )
        : undefined;
    }
  }
};

export function getInfantNearestPreviousVisitByOrderDate(
  state: RootState,
  currentVisit?: VisitDto
): VisitDto | undefined {
  const visits = state.infants.visits;

  if (!visits?.length || !currentVisit) return undefined;

  if (currentVisit.visitType?.name === 'additional_visits') {
    const currentPlannedDate = new Date(currentVisit?.plannedVisitDate!);
    currentPlannedDate?.setHours(23, 59, 59, 0);

    const previousVisits = visits.filter(
      (item) =>
        item.attended &&
        item.actualVisitDate !== null &&
        new Date(item.actualVisitDate) < currentPlannedDate
    );

    if (previousVisits.length === 0) {
      return undefined; // No previous date found
    }

    const nearestDateObject = previousVisits.reduce((previous, current) => {
      if (
        !previous ||
        new Date(currentVisit?.plannedVisitDate!).getTime() -
          new Date(current.actualVisitDate).getTime() <
          new Date(currentVisit?.plannedVisitDate!).getTime() -
            new Date(previous.actualVisitDate).getTime()
      ) {
        return current;
      }
      return previous;
    });

    return nearestDateObject;
  }

  const currentOrderDate = new Date(currentVisit?.orderDate!);

  const previousVisits = visits.filter(
    (item) =>
      item.attended &&
      item.orderDate !== null &&
      new Date(item.orderDate) < currentOrderDate
  );

  if (previousVisits.length === 0) {
    return undefined; // No previous date found
  }

  const nearestDateObject = previousVisits.reduce((previous, current) => {
    if (
      !previous ||
      currentOrderDate.getTime() - new Date(current.orderDate).getTime() <
        currentOrderDate.getTime() - new Date(previous.orderDate).getTime()
    ) {
      return current;
    }
    return previous;
  });

  return nearestDateObject;
}
