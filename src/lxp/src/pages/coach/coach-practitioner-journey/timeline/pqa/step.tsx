import { CalendarEventModel } from '@ecdlink/core';
import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { StepType, getStepType, sortVisit } from '../timeline-steps';
import { RatingData as RatingDataUtils, getRatingData } from '../utils';
import { RatingData } from '@/store/pqa/pqa.types';

interface Props {
  timeline: PractitionerTimeline;
  currentPqaRating: RatingData;
  practitionerEvents?: CalendarEventModel[];
}

export const getPqaStepData = ({
  timeline,
  practitionerEvents,
  currentPqaRating,
}: Props): {
  currentVisitEvent?: CalendarEventModel;
  currentVisit?: Maybe<Visit>;
  stepType?: StepType;
  subTitleText?: string;
  ratingData?: RatingDataUtils;
} => {
  if (!timeline.pQASiteVisits?.length) return {};

  const formattedVisits = timeline.pQASiteVisits
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
            e.eventType === 'First PQA' &&
            e.action?.state !== undefined &&
            e.action?.state.action === 'onStart' &&
            e.action?.state.actionParams !== undefined &&
            e.action?.state.actionParams.visitName ===
              currentVisit.visitType?.name
        )
      : undefined;

  const isLateDate =
    new Date(currentVisit?.plannedVisitDate) < new Date() &&
    timeline.pQASiteVisits.some((item) => !item?.attended);
  const isAllCompleted = timeline.pQASiteVisits?.every(
    (item) => !!item?.attended
  );

  const stepType = getStepType(
    currentPqaRating?.rating?.overallRatingColor?.toLocaleLowerCase() ||
      '' ||
      (isLateDate ? 'error' : '') ||
      (isAllCompleted ? 'success' : '') ||
      undefined
  );

  const ratingData = getRatingData(
    currentPqaRating?.rating?.overallRatingColor
  );

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
    currentVisitEvent,
    currentVisit,
    stepType,
    subTitleText: getSubTitleText(),
    ratingData,
  };
};
