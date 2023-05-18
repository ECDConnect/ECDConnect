import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import { CoachPractitionerTimeline, FormData } from './pqa.types';

export const getPractitionerTimelineByIdSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.coachPractitionersTimeline,
    (items: CoachPractitionerTimeline[] | undefined) => {
      return items?.find((item) => item.practitionerId === userId)?.timeline;
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

export const getPreviousCoachVisitByUserId = (
  currentVisitDescription: string,
  userId: string
) =>
  createSelector([getPractitionerTimelineByIdSelector(userId)], (timeline) => {
    const currentVisit = timeline?.siteVisits?.find(
      (visit) => visit?.visitType?.description === currentVisitDescription
    );

    if (currentVisit) {
      const previousVisit = timeline?.siteVisits?.find(
        (visit) =>
          visit?.visitType?.order === Number(currentVisit?.visitType?.order) - 1
      );
      return previousVisit || undefined;
    }

    return undefined;
  });
