import { Visit, Maybe } from '@ecdlink/graphql';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import {
  getCurrentPQaRatingByUserId,
  getLastCoachAttendedFollowUpVisitByUserId,
  getLastCoachAttendedVisitByUserId,
  getPractitionerTimelineByIdSelector,
} from '@/store/pqa/pqa.selectors';
import { addDays } from 'date-fns';
import { followUpDeadline, getRatingData } from '../utils';
import { visitTypes } from '../../coach-practitioner-journey.types';
import { ScheduleProps, dateOptions, getStepType } from '../timeline-steps';

interface PQAVisitsProps {
  isLoading: boolean;
  currentVisit: Maybe<Visit>;
  practitionerId: string;
  currentVisitEventId: string | undefined;
  isOnline: boolean;
  onStart: (visitName: string) => void;
  onScheduleOrStart: (schedule: ScheduleProps) => void;
}

export const newPqaFollowUpId = 'new-pqa-follow-up';
export const newPqaVisitId = 'new-pqa-visit';

export const PQAVisits = ({
  currentVisit,
  practitionerId,
  currentVisitEventId,
  onStart,
  onScheduleOrStart,
}: PQAVisitsProps) => {
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );
  const currentPqaRating = useSelector(
    getCurrentPQaRatingByUserId(practitionerId)
  );
  const lastAttendedPqaVisit = useSelector(
    getLastCoachAttendedVisitByUserId(
      practitionerId,
      'pQASiteVisits',
      'pqa_visit_follow_up'
    )
  );
  const lastAttendedPqaFollowUpVisit = useSelector(
    getLastCoachAttendedFollowUpVisitByUserId(
      practitionerId,
      'pQASiteVisits',
      'pqa_visit_follow_up'
    )
  );

  const pqaRating1 = timeline?.pQARating1;
  const pqaRating2 = timeline?.pQARating2;
  const pqaRating3 = timeline?.pQARating3;

  // INFO: The user can start the follow-up after 14 days, but if it's the last visit (third one), this number changes to 60 days
  const currentFollowUpDeadline = pqaRating3?.overallRating
    ? followUpDeadline.lastVisit
    : followUpDeadline.default;
  const isPQAFollowUpDeadline =
    addDays(
      new Date(lastAttendedPqaVisit?.insertedDate),
      currentFollowUpDeadline
    ) <= new Date();
  const isNewVisit =
    !pqaRating3?.overallRating &&
    timeline?.pQASiteVisits?.some(
      (item) =>
        item?.attended && item?.visitType?.name !== visitTypes.pqa.followUp.name
    ) &&
    new Date(lastAttendedPqaFollowUpVisit?.insertedDate) >
      new Date(lastAttendedPqaVisit?.insertedDate);
  const isPQAFollowUp =
    !!currentPqaRating.rating?.overallRatingColor &&
    currentPqaRating.rating?.overallRatingColor !== 'Success' &&
    !lastAttendedPqaVisit?.visitType?.name?.includes(
      visitTypes.pqa.thirdPQA.name
    ) &&
    !isNewVisit;

  const mergedVisits = timeline?.pQASiteVisits
    ? [
        ...timeline.pQASiteVisits,
        ...(isPQAFollowUp
          ? [
              {
                id: newPqaFollowUpId,
                visitType: {
                  description: `Follow-up visit ${currentPqaRating.visitNumber}`,
                  name: visitTypes.pqa.followUp.name,
                },
                plannedVisitDate: addDays(
                  new Date(lastAttendedPqaVisit?.insertedDate),
                  currentFollowUpDeadline
                ),
                attended: false,
              } as Maybe<Visit>,
            ]
          : []),
        ...(isNewVisit
          ? [
              {
                id: newPqaVisitId,
                visitType: {
                  description: `First PQA visit`,
                  name: visitTypes.pqa.firstPQA.name,
                },
                plannedVisitDate: lastAttendedPqaFollowUpVisit?.insertedDate,
                attended: false,
              } as Maybe<Visit>,
            ]
          : []),
      ]
    : [];

  const sortedVisits = mergedVisits.sort((a, b) => {
    if (!a?.insertedDate && !b?.insertedDate) {
      return 0;
    } else if (!a?.insertedDate) {
      return 1;
    } else if (!b?.insertedDate) {
      return -1;
    }

    return (
      new Date(a.insertedDate).getTime() - new Date(b.insertedDate).getTime()
    );
  });

  const getVisitRating = (item: Maybe<Visit>) => {
    switch (item?.visitType?.name) {
      case visitTypes.pqa.thirdPQA.name:
        return pqaRating3;
      case visitTypes.pqa.secondPQA.name:
        return pqaRating2;
      default:
        return pqaRating1;
    }
  };

  const renderIcon = (item: Maybe<Visit>) => {
    if (
      item?.attended &&
      !item.visitType?.name?.includes(visitTypes.pqa.followUp.name)
    ) {
      return getRatingData(getVisitRating(item)?.overallRatingColor).icon;
    }

    return (
      <span>
        <CalendarIcon className="text-primary h-4 w-4" />
      </span>
    );
  };

  const getSubTitleText = (item: Maybe<Visit>) => {
    if (!!currentVisitEventId) {
      return 'Scheduled ';
    }

    if (!item?.attended) {
      return 'By ';
    }

    return '';
  };

  const getButtonText = (item: Maybe<Visit>) => {
    if (!currentVisitEventId) {
      return 'Schedule';
    }
    return 'Start';
  };

  const getButtonIcon = (item: Maybe<Visit>) => {
    if (!currentVisitEventId) {
      return 'CalendarIcon';
    }
    return 'ArrowCircleRightIcon';
  };

  const onClick = (options: ScheduleProps) => {
    if (!currentVisitEventId) {
      onScheduleOrStart(options);
    } else {
      onStart(options.visit.visitType?.name as string);
    }
  };

  return (
    <>
      {sortedVisits.map((item) => (
        <div className="my-4" key={item?.id}>
          <div className="relative flex items-center gap-1">
            {renderIcon(item)}
            <Typography
              type="body"
              color="textDark"
              className="w-6/12 font-bold"
              text={item?.visitType?.description || ''}
            />
            {((item?.id === currentVisit?.id && !item?.attended) ||
              (item?.visitType?.name === visitTypes.pqa.followUp.name &&
                item.attended === false &&
                isPQAFollowUpDeadline) ||
              (item?.id === newPqaVisitId && !item.attended)) && (
              <Button
                style={{
                  position: 'absolute',
                  right: -36,
                }}
                className="z-50 w-32"
                textColor="primary"
                type="outlined"
                color="primary"
                text={getButtonText(item)}
                iconPosition="start"
                icon={getButtonIcon(item)}
                onClick={() =>
                  onClick({
                    visit: item as Visit,
                    visitEventId: currentVisitEventId,
                    eventType: 'First PQA',
                  })
                }
              />
            )}
          </div>
          <Typography
            type="body"
            // TODO: add schedule integration
            color={getStepType(String('Success'))?.color || 'textMid'}
            text={
              !!item?.plannedVisitDate
                ? `${getSubTitleText(item)}${new Date(
                    item.attended ? item.insertedDate : item.plannedVisitDate
                  ).toLocaleDateString('en-ZA', dateOptions)}`
                : ''
            }
          />
        </div>
      ))}
    </>
  );
};
