import { Maybe, PractitionerTimeline, Visit } from '@ecdlink/graphql';
import { RatingData } from '@/store/pqa/pqa.types';
import { StepType, getStepType } from '../../utils';
import {
  RatingData as RatingDataUtils,
  getRatingData,
} from '@/pages/coach/coach-practitioner-journey/timeline/utils';

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
  const attendedPqaVisits = timeline?.pQASiteVisits?.filter(
    (item) => !!item?.attended
  );

  if (!attendedPqaVisits?.length) return {};

  const visitToAttend = attendedPqaVisits.find((item) => !item?.attended);
  const currentVisit = !!visitToAttend
    ? visitToAttend
    : attendedPqaVisits[attendedPqaVisits.length - 1];

  const isLateDate =
    new Date(currentVisit?.plannedVisitDate) < new Date() &&
    attendedPqaVisits.some((item) => !item?.attended);
  const isAllCompleted = attendedPqaVisits?.every((item) => !!item?.attended);

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

  return {
    currentVisit,
    stepType,
    ratingData,
  };
};
