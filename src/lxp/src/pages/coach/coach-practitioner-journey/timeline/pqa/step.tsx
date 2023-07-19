import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { StepType, getStepType, sortVisit } from '../timeline-steps';
import { RatingData as RatingDataUtils, getRatingData } from '../utils';
import { RatingData } from '@/store/pqa/pqa.types';

interface Props {
  timeline: PractitionerTimeline;
  currentPqaRating: RatingData;
}

export const getPqaStepData = ({
  timeline,
  currentPqaRating,
}: Props): {
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
