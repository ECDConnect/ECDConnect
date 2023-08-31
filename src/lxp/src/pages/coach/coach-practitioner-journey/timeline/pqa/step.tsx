import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { StepType, getStepType } from '../timeline-steps';
import { RatingData as RatingDataUtils, getRatingData } from '../utils';
import { RatingData } from '@/store/pqa/pqa.types';

interface Props {
  pQASiteVisits: PractitionerTimeline['pQASiteVisits'];
  currentPqaRating: RatingData;
}

export const getPqaStepData = ({
  pQASiteVisits,
  currentPqaRating,
}: Props): {
  currentVisit?: Maybe<Visit>;
  stepType?: StepType;
  subTitleText?: string;
  ratingData?: RatingDataUtils;
} => {
  if (!pQASiteVisits?.length) return {};

  const visits = pQASiteVisits;

  const visitToAttend = visits.find((item) => !item?.attended);
  const currentVisit = !!visitToAttend
    ? visitToAttend
    : visits[visits.length - 1];

  const isLateDate =
    new Date(currentVisit?.plannedVisitDate) < new Date() &&
    pQASiteVisits.some((item) => !item?.attended);
  const isAllCompleted = pQASiteVisits?.every((item) => !!item?.attended);

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
