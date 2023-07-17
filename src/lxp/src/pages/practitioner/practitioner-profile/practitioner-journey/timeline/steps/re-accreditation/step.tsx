import { RatingData } from '@/store/pqa/pqa.types';
import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { StepType, getStepType, sortVisit } from '../../utils';
import {
  RatingData as RatingDataUtils,
  getRatingData,
} from '@/pages/coach/coach-practitioner-journey/timeline/utils';

interface Props {
  timeline: PractitionerTimeline;
  currentRating: RatingData;
}

export const getReAccreditationStepData = ({
  timeline,
  currentRating,
}: Props): {
  currentVisit?: Maybe<Visit>;
  stepType?: StepType;
  ratingData?: RatingDataUtils;
} => {
  const attendedReAccreditationVisits = timeline.reAccreditationVisits?.filter(
    (item) => !!item?.attended
  );

  if (!attendedReAccreditationVisits?.length) {
    return {};
  }

  const formattedVisits = attendedReAccreditationVisits
    ?.filter(
      (visit: Maybe<Visit>) => typeof visit?.visitType?.order !== 'undefined'
    )
    ?.sort(sortVisit);

  const visitToAttend = formattedVisits.find((item) => !item?.attended);
  const currentVisit = !!visitToAttend
    ? visitToAttend
    : formattedVisits[formattedVisits.length - 1];

  const isLateDate =
    new Date(currentVisit?.plannedVisitDate) < new Date() &&
    attendedReAccreditationVisits.some((item) => !item?.attended);
  const isAllCompleted = attendedReAccreditationVisits?.every(
    (item) => !!item?.attended
  );

  const stepType = getStepType(
    (isLateDate ? 'error' : '') ||
      (isAllCompleted ? 'success' : '') ||
      undefined
  );

  const ratingData = getRatingData(currentRating?.rating?.overallRatingColor);

  return {
    currentVisit,
    stepType,
    ratingData,
  };
};
