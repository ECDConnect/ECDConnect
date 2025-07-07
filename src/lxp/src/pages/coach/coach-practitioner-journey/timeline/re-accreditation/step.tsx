import { RatingData } from '@/store/pqa/pqa.types';
import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { StepType, getStepType } from '../timeline-steps';
import { RatingData as RatingDataUtils, getRatingData } from '../utils';

interface Props {
  reAccreditationVisits: PractitionerTimeline['reAccreditationVisits'];
  currentRating: RatingData;
}

export const getReAccreditationStepData = ({
  reAccreditationVisits,
  currentRating,
}: Props): {
  currentVisit?: Maybe<Visit>;
  stepType?: StepType;
  subTitleText?: string;
  ratingData?: RatingDataUtils;
} => {
  if (!reAccreditationVisits?.length) {
    return {};
  }

  const visits = reAccreditationVisits;

  const visitToAttend = visits.find((item) => !item?.attended);
  const currentVisit = !!visitToAttend
    ? visitToAttend
    : visits[visits.length - 1];

  const isLateDate =
    new Date(currentVisit?.plannedVisitDate) < new Date() &&
    reAccreditationVisits.some((item) => !item?.attended);
  const isAllCompleted = reAccreditationVisits?.every(
    (item) => !!item?.attended
  );

  const stepType = getStepType(
    (isLateDate ? 'error' : '') ||
      (isAllCompleted ? 'success' : '') ||
      undefined
  );

  const ratingData = getRatingData(currentRating?.rating?.overallRatingColor);

  const getSubTitleText = () => {
    if (!!currentVisit?.eventId) {
      return 'Scheduled';
    }

    if (visitToAttend) {
      return 'By';
    }

    return '';
  };

  return {
    currentVisit,
    stepType,
    subTitleText: getSubTitleText(),
    ratingData,
  };
};
