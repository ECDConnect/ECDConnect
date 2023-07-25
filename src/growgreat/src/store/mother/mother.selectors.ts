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
  state: RootState,
  visitId: string
): VisitDto | undefined => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allVisits =
    state.mothers.visits?.filter(
      (item) => item.visitType?.name !== 'additional_visits'
    ) || [];

  // Priority 1: if a visit id is available, then return visit for id
  if (visitId && visitId !== '') {
    const visits = state.mothers.visits || [];
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

export const getMotherLastVisitSelector = (
  state: RootState,
  visitId?: string
): VisitDto | undefined => {
  const visits = state.mothers.visits || [];
  const lastAttended = visits?.filter((item) => item.attended) || [];

  if (visitId && visitId !== '') {
    const visits = state.mothers.visits || [];
    for (var i = 0; i < visits.length; i++) {
      if (visits[i].id === visitId) {
        return visits[i];
      }
    }
  } else {
    return lastAttended.length
      ? lastAttended.reduce((prev, curr) =>
          (prev.visitType?.order || 0) > (curr.visitType?.order || 0)
            ? prev
            : curr
        )
      : undefined;
  }
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

export const getIsMotherFirstVisitSelector = (state: RootState): boolean => {
  const visits = state.mothers.visits;

  const attendedVisitsCount = visits?.filter((item) => !!item.attended).length;

  return attendedVisitsCount === 0;
};

export function getMotherNearestPreviousVisitByOrderDate(
  state: RootState,
  currentVisit?: VisitDto
): VisitDto | undefined {
  const visits = state.mothers.visits;

  if (!visits?.length) return undefined;

  const currentOrderDate = currentVisit
    ? new Date(currentVisit?.orderDate!)
    : new Date();
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

export const getMotherFirstVisitSelector = (
  state: RootState
): VisitDto | null => {
  const visits = state.mothers.visits;

  if (!visits) return null;

  const filteredVisits = visits.filter((visit) => {
    const orderDate = new Date(visit.orderDate);
    return (
      orderDate.getFullYear() !== 0 &&
      visit.attended &&
      visit.visitType?.normalizedName !== 'Additional visits'
    );
  });
  const firstVisit = filteredVisits?.reduce(
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
