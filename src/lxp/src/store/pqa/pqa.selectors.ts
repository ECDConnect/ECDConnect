import { RootState } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import { CoachPractitionerTimeline } from './pqa.types';

export const getPractitionerTimelineSelector = (userId: string) => {
  return createSelector(
    (state: RootState) => state.pqa.coachPractitionersTimeline,
    (items: CoachPractitionerTimeline[] | undefined) => {
      return items?.find((item) => item.practitionerId === userId)?.timeline;
    }
  );
};
