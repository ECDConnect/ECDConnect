import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import {
  CoachPractitionerTimeline,
  FormData,
  PqaRatingData,
  PreviousFormData,
} from './pqa.types';

export const getPractitionerTimelineByIdSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.coachPractitionersTimeline,
    (items: CoachPractitionerTimeline[] | undefined) => {
      return items?.find((item) => item.practitionerId === userId)?.timeline;
    }
  );
};

export const getReAccreditationFormDataByIdSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.reAccreditationFormData,
    (items: FormData[] | undefined) => {
      return items
        ?.filter((item) => item.practitionerId === userId)
        .map((item) => item.formData);
    }
  );
};

export const getPrePqaFormDataByIdSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.prePqaFormData,
    (items: FormData[] | undefined) => {
      return items
        ?.filter((item) => item.practitionerId === userId)
        .map((item) => item.formData);
    }
  );
};

export const getPqaFormDataByIdSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.pqaFormData,
    (items: FormData[] | undefined) => {
      return items
        ?.filter((item) => item.practitionerId === userId)
        .map((item) => item.formData);
    }
  );
};

export const getCurrentCoachPractitionerVisitByUserId = (
  currentVisitName: string,
  userId: string
) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const currentVisit = timeline?.prePQASiteVisits?.find(
      (visit) => visit?.visitType?.name === currentVisitName
    );

    return currentVisit || undefined;
  });

export const getPreviousCoachVisitByUserId = (
  currentVisitName: string,
  userId: string
) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const currentVisit = timeline?.prePQASiteVisits?.find(
      (visit) => visit?.visitType?.name === currentVisitName
    );

    if (currentVisit) {
      const previousVisit = timeline?.prePQASiteVisits?.find(
        (visit) =>
          visit?.visitType?.order === Number(currentVisit?.visitType?.order) - 1
      );
      return previousVisit || undefined;
    }

    return undefined;
  });

export const getVisitDataForVisitIdSelectorByUserId = (
  userId: string,
  visitId: string
) => {
  return createSelector(
    (state: RootState) => state.pqa.prePqaPreviousFormData,
    (items: PreviousFormData[] | undefined) => {
      return items?.find((item) => item.visitId === visitId)?.formData;
    }
  );
};

export const getCurrentPQaRatingByUserId = (userId: string) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const pqaRating1 = timeline?.pQARating1;
    const pqaRating2 = timeline?.pQARating2;
    const pqaRating3 = timeline?.pQARating3;

    if (pqaRating3?.overallRating) {
      return {
        rating: pqaRating3,
        visitNumber: 3,
      } as PqaRatingData;
    }

    if (pqaRating2?.overallRating) {
      return {
        rating: pqaRating2,
        visitNumber: 2,
      } as PqaRatingData;
    }

    return {
      rating: pqaRating1,
      visitNumber: 1,
    } as PqaRatingData;
  });

export const getLastCoachAttendedVisitByUserId = (userId: string) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const attendedVisits = timeline?.pQASiteVisits?.filter(
      (visit) =>
        visit?.attended && !visit?.visitType?.name?.includes('follow_up')
    );

    if (attendedVisits?.length === 0) {
      return null;
    }

    return attendedVisits?.reduce((mostRecentVisit, visit) => {
      if (
        !mostRecentVisit ||
        new Date(visit?.insertedDate) > new Date(mostRecentVisit.insertedDate)
      ) {
        return visit;
      }

      return mostRecentVisit;
    }, null);
  });
