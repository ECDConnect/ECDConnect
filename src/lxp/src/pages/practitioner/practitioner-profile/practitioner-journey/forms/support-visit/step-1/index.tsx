import { Divider, Note, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import {
  getLastCoachAttendedVisitByUserId,
  getPractitionerTimelineByIdSelector,
  getVisitDataForVisitIdSelectorByUserId,
} from '@/store/pqa/pqa.selectors';
import {
  callAnswer,
  supportVisitQuestion2,
  supportVisitSharedQuestion,
} from '@/pages/coach/coach-practitioner-journey/forms/general-support-visit';
import { useLayoutEffect, useMemo } from 'react';

import { DynamicFormProps } from '../../dynamic-form';
import { currentActivityKey, visitIdKey } from '../..';
import {
  dateLongDayOptions,
  dateLongMonthOptions,
} from '../../../timeline/utils';
import { PQAStateKeys } from '@/store/pqa/pqa.types';
import { visitTypes as coachVisitTypes } from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';

export const SupportVisitStep1 = ({
  setEnableButton,
  smartStarter,
}: DynamicFormProps) => {
  const userId = smartStarter?.id ?? '';
  const visitId = window.sessionStorage.getItem(visitIdKey) || '';
  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  const isSupportVisit = activityName === coachVisitTypes.supportVisit;
  const isPqaVisit = activityName === coachVisitTypes.pqa.followUp.name;
  const isReAccreditationVisit =
    activityName === coachVisitTypes.reaccreditation.followUp.name;

  const timeline = useSelector(getPractitionerTimelineByIdSelector(userId));

  const lastVisit = useSelector(
    getLastCoachAttendedVisitByUserId(
      userId,
      isPqaVisit ? 'pQASiteVisits' : 'reAccreditationVisits',
      isPqaVisit ? 'pqa_visit_follow_up' : 're_accreditation_follow_up'
    )
  );

  const lastVisitDate = lastVisit
    ? new Date(lastVisit.insertedDate).toLocaleDateString(
        'en-ZA',
        dateLongMonthOptions
      )
    : '';

  const pqaRating1 = timeline?.pQARating1;
  const pqaRating2 = timeline?.pQARating2;

  const reAccreditationRating1 = timeline?.reAccreditationRating1;
  const reAccreditationRating2 = timeline?.reAccreditationRating2;

  const pqaRating = pqaRating2?.overallRating
    ? pqaRating2.overallRatingColor
    : pqaRating1?.overallRatingColor;
  const reAccreditationRating = reAccreditationRating2?.overallRating
    ? reAccreditationRating2.overallRatingColor
    : reAccreditationRating1?.overallRatingColor;

  const rating = isPqaVisit ? pqaRating : reAccreditationRating;

  const ratingColor = useMemo(() => {
    if (rating === 'Error') {
      return 'red';
    }

    if (rating === 'Warning') {
      return 'orange';
    }

    return 'green';
  }, [rating]);

  const stateType = useMemo((): PQAStateKeys => {
    switch (activityName) {
      case coachVisitTypes.pqa.followUp.name:
        return 'pqaFollowUpPreviousFormData';
      case coachVisitTypes.reaccreditation.followUp.name:
        return 'reAccreditationFollowUpVisitPreviousFormData';
      default:
        return 'supportVisitPreviousFormData';
    }
  }, [activityName]);

  const data = useSelector(
    getVisitDataForVisitIdSelectorByUserId(
      smartStarter?.id || '',
      visitId,
      stateType
    )
  );

  const note1 = data?.find(
    (item) => item.question === supportVisitSharedQuestion
  );
  const note2 = data?.find((item) => item.question === supportVisitQuestion2);
  const noteDate = new Date(note1?.insertedDate).toLocaleDateString(
    'en-ZA',
    dateLongDayOptions
  );

  const visitType = data?.find((item) =>
    item.question?.includes('support phone call')
  )?.questionAnswer;
  const isCallAnswer = visitType === callAnswer;

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text={`Coaching ${isCallAnswer ? 'call' : 'visit'}`}
        color="textDark"
      />
      <Typography type="h4" text={noteDate} color="textMid" />
      <Divider dividerType="dashed" className="my-4" />
      {(isPqaVisit || isReAccreditationVisit) && (
        <Typography
          type="h4"
          text={`You received an ${ratingColor} ${
            isPqaVisit ? 'PQA' : 're-accreditation'
          } rating${lastVisitDate ? ` on ${lastVisitDate}` : ''}`}
          color="textDark"
          className="mb-4"
        />
      )}
      {note2 && (
        <Note
          title="Focus of the coaching visit"
          body={note2?.questionAnswer!}
          className="mb-4"
        />
      )}
      {note1 && (
        <Note
          title={
            isSupportVisit
              ? 'Next steps from discussion'
              : 'Next steps agreed with coach'
          }
          subTitle={isSupportVisit ? noteDate : ''}
          body={note1?.questionAnswer!}
        />
      )}
    </div>
  );
};
