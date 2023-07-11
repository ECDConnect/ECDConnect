import { RatingData } from '@/store/pqa/pqa.types';
import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { StepType, getStepType, sortVisit } from '../timeline-steps';
import { RatingData as RatingDataUtils, getRatingData } from '../utils';
import { CalendarEventModel } from '@ecdlink/core';

interface Props {
  timeline: PractitionerTimeline;
  currentRating: RatingData;
  practitionerEvents?: CalendarEventModel[];
}

export const getReAccreditationStepData = ({
  timeline,
  practitionerEvents,
  currentRating,
}: Props): {
  currentVisit?: Maybe<Visit>;
  stepType?: StepType;
  subTitleText?: string;
  ratingData?: RatingDataUtils;
  currentVisitEvent?: CalendarEventModel;
} => {
  if (!timeline.reAccreditationVisits?.length) {
    return {};
  }

  const formattedVisits = timeline.reAccreditationVisits
    ?.filter(
      (visit: Maybe<Visit>) => typeof visit?.visitType?.order !== 'undefined'
    )
    ?.sort(sortVisit);

  const visitToAttend = formattedVisits.find((item) => !item?.attended);
  const currentVisit = !!visitToAttend
    ? visitToAttend
    : formattedVisits[formattedVisits.length - 1];
  const currentVisitEvent =
    !!currentVisit && !!practitionerEvents
      ? practitionerEvents.find(
          (e) =>
            e.eventType === 'ReAccreditation' &&
            e.action?.state !== undefined &&
            e.action?.state.action === 'onStart' &&
            e.action?.state.actionParams !== undefined &&
            e.action?.state.actionParams.visitName ===
              currentVisit.visitType?.name
        )
      : undefined;

  const isLateDate =
    new Date(currentVisit?.plannedVisitDate) < new Date() &&
    timeline.reAccreditationVisits.some((item) => !item?.attended);
  const isAllCompleted = timeline.reAccreditationVisits?.every(
    (item) => !!item?.attended
  );

  const stepType = getStepType(
    (isLateDate ? 'error' : '') ||
      (isAllCompleted ? 'success' : '') ||
      undefined
  );

  const ratingData = getRatingData(currentRating?.rating?.overallRatingColor);

  const getSubTitleText = () => {
    if (!!currentVisitEvent) {
      return 'Scheduled';
    }

    if (visitToAttend) {
      return 'By';
    }

    return '';
  };

  return {
    currentVisit,
    currentVisitEvent,
    stepType,
    subTitleText: getSubTitleText(),
    ratingData,
  };
};
