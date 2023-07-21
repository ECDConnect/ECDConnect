import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import {
  PractitionerTimelineState,
  FormData,
  RatingData,
  PreviousFormData,
  FollowUpType,
  VisitType,
  PQAStateKeys,
} from './pqa.types';
import { getSectionQuestions } from '@/pages/practitioner/practitioner-profile/practitioner-journey/utils';

export const getPractitionerTimelineByIdSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.coachPractitionersTimeline,
    (items: PractitionerTimelineState[] | undefined) => {
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

export const getVisitDataByVisitIdSelector = (
  visitId: string,
  stateType: PQAStateKeys
) => {
  return createSelector(
    (state: RootState) => state.pqa[stateType],
    (items: PreviousFormData[] | undefined) => {
      return items?.find((item) => item.visitId === visitId)?.formData;
    }
  );
};

export const getAllSectionsQuestions = (
  visitId: string,
  stateType: PQAStateKeys
) =>
  createSelector(
    [getVisitDataByVisitIdSelector(visitId, stateType)],
    (formData) => {
      const sectionQuestions = getSectionQuestions(formData);

      return sectionQuestions;
    }
  );

export const getSectionsQuestionsByStep = (
  visitId: string,
  stateType: PQAStateKeys,
  visitSection: string
) =>
  createSelector(
    [getVisitDataByVisitIdSelector(visitId, stateType)],
    (formData) => {
      const sectionQuestions = getSectionQuestions(formData);

      const currentSection = sectionQuestions?.find(
        (item) => item.visitSection === visitSection
      );

      return currentSection;
    }
  );

export const getCurrentPQaRatingByUserId = (userId: string) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const pqaRating1 = timeline?.pQARating1;
    const pqaRating2 = timeline?.pQARating2;
    const pqaRating3 = timeline?.pQARating3;

    if (pqaRating3?.overallRating) {
      return {
        rating: pqaRating3,
        visitNumber: 3,
      } as RatingData;
    }

    if (pqaRating2?.overallRating) {
      return {
        rating: pqaRating2,
        visitNumber: 2,
      } as RatingData;
    }

    return {
      rating: pqaRating1,
      visitNumber: 1,
    } as RatingData;
  });

export const getCurrentReAccreditationRatingByUserId = (userId: string) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const rating1 = timeline?.reAccreditationRating1;
    const rating2 = timeline?.reAccreditationRating2;
    const rating3 = timeline?.reAccreditationRating3;

    if (rating3?.overallRating) {
      return {
        rating: rating3,
        visitNumber: 3,
      } as RatingData;
    }

    if (rating2?.overallRating) {
      return {
        rating: rating2,
        visitNumber: 2,
      } as RatingData;
    }

    return {
      rating: rating1,
      visitNumber: 1,
    } as RatingData;
  });

export const getLastCoachAttendedVisitByUserId = (
  userId: string,
  visitType: VisitType,
  followUpType: FollowUpType
) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const attendedVisits = timeline?.[visitType]?.filter(
      (visit) =>
        visit?.attended && !visit?.visitType?.name?.includes(followUpType)
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

export const getLastCoachAttendedFollowUpVisitByUserId = (
  userId: string,
  visitType: VisitType,
  followUpType: FollowUpType
) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const attendedVisits = timeline?.[visitType]?.filter(
      (visit) =>
        visit?.attended && visit?.visitType?.name?.includes(followUpType)
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
