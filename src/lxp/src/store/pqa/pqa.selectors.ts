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
import {
  maxNumberOfVisits,
  visitTypes,
} from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import { chunkArray } from '@ecdlink/core';
import { Maybe, PqaRating, Visit } from '@ecdlink/graphql';
import { sortVisits } from '@/pages/coach/coach-practitioner-journey/timeline/utils';

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
    const visits =
      timeline?.pQASiteVisits?.filter(
        (item) => item?.visitType?.name !== visitTypes.pqa.followUp.name
      ) ?? [];
    const sortedVisits = sortVisits(visits);

    const pqaRatings =
      timeline?.pQARatings
        ?.filter((item) => item?.visitTypeName !== visitTypes.pqa.followUp.name)
        ?.map((item) => ({
          item,
          order: sortedVisits?.findIndex(
            (visit) => visit?.id === item?.visitId
          ),
        })) ?? [];

    const pqaRating1 = pqaRatings?.find((item) => item?.order === 0)?.item;
    const pqaRating2 = pqaRatings?.find((item) => item?.order === 1)?.item;
    const pqaRating3 = pqaRatings?.find((item) => item?.order === 2)?.item;

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
    const visits =
      timeline?.reAccreditationVisits?.filter(
        (item) =>
          item?.visitType?.name !== visitTypes.reaccreditation.followUp.name
      ) ?? [];
    const sortedVisits = sortVisits(visits);

    // All years
    const filteredReAccreditationRatings =
      timeline?.reAccreditationRatings?.filter(
        (item) =>
          item?.visitTypeName !== visitTypes.reaccreditation.followUp.name
      ) ?? [];
    const subdividedReAccreditationRatings = chunkArray<Maybe<PqaRating>>(
      filteredReAccreditationRatings,
      maxNumberOfVisits
    );
    const reAccreditationRatingsFromCurrentYear =
      subdividedReAccreditationRatings?.[
        subdividedReAccreditationRatings.length - 1
      ];

    const reAccreditationRatings =
      reAccreditationRatingsFromCurrentYear
        ?.filter(
          (item) =>
            item?.visitTypeName !== visitTypes.reaccreditation.followUp.name
        )
        ?.map((item) => ({
          item,
          order: sortedVisits?.findIndex(
            (visit) => visit?.id === item?.visitId
          ),
        })) ?? [];

    const rating1 = reAccreditationRatings?.find(
      (item) => item?.order === 0
    )?.item;
    const rating2 = reAccreditationRatings?.find(
      (item) => item?.order === 1
    )?.item;
    const rating3 = reAccreditationRatings?.find(
      (item) => item?.order === 2
    )?.item;

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

export const getLastCoachAttendedVisitByUserId = ({
  userId,
  visitType,
  followUpType,
}: {
  userId: string;
  visitType: VisitType;
  followUpType?: FollowUpType;
}) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const attendedVisits = timeline?.[visitType]?.filter((visit) => {
      if (followUpType) {
        return (
          visit?.attended &&
          !visit?.visitType?.name?.includes(followUpType ?? '')
        );
      }

      return visit?.attended;
    });

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

export const getLatestPqaOrReacreditationRatingByUserId = (userId: string) =>
  createSelector(getPractitionerTimelineByIdSelector(userId), (timeline) => {
    const ratings = [
      ...(timeline?.pQARatings || []),
      ...(timeline?.reAccreditationRatings || []),
    ];

    if (ratings.length === 0) {
      return null;
    }

    return ratings?.reduce((mostRecentRating, rating) => {
      if (
        !mostRecentRating ||
        new Date(rating?.insertedDate) > new Date(mostRecentRating.insertedDate)
      ) {
        return rating;
      }

      return mostRecentRating;
    }, null);
  });

export const getCalendarEventLinkedVisit = (id: string) =>
  createSelector(
    (state: RootState) => state.pqa.coachPractitionersTimeline,
    (coachPractitionersTimeline: PractitionerTimelineState[] | undefined) => {
      var visit: Visit | null | undefined;
      if (!!coachPractitionersTimeline) {
        const found = coachPractitionersTimeline.find((x) => {
          visit = x.timeline.pQASiteVisits?.find((v) => v?.eventId === id);
          if (!!visit) return true;
          visit = x.timeline.supportVisits?.find((v) => v?.eventId === id);
          if (!!visit) return true;
          visit = x.timeline.prePQASiteVisits?.find((v) => v?.eventId === id);
          if (!!visit) return true;
          visit = x.timeline.requestedCoachVisits?.find(
            (v) => v?.eventId === id
          );
          if (!!visit) return true;
          visit = x.timeline.selfAssessmentVisits?.find(
            (v) => v?.eventId === id
          );
          if (!!visit) return true;
          visit = x.timeline.reAccreditationVisits?.find(
            (v) => v?.eventId === id
          );
          if (!!visit) return true;
          return false;
        });
        if (!!visit) return visit;
      }
      return null;
    }
  );
