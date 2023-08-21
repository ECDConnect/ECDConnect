import { Visit, Maybe } from '@ecdlink/graphql';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import {
  getCurrentPQaRatingByUserId,
  getLastCoachAttendedVisitByUserId,
  getPractitionerTimelineByIdSelector,
} from '@/store/pqa/pqa.selectors';
import { addDays } from 'date-fns';
import { followUpDeadline, getRatingData } from '../utils';
import {
  maxNumberOfVisits,
  visitTypes,
} from '../../coach-practitioner-journey.types';
import { ScheduleProps, dateOptions, getStepType } from '../timeline-steps';

interface PQAVisitsProps {
  isLoading: boolean;
  currentVisit: Maybe<Visit>;
  practitionerId: string;
  isOnline: boolean;
  onStart: (visitName: string) => void;
  onScheduleOrStart: (schedule: ScheduleProps) => void;
}

export const newPqaFollowUpId = 'new-pqa-follow-up';
export const newPqaVisitId = 'new-pqa-visit';

export const PQAVisits = ({
  currentVisit,
  practitionerId,
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
    getLastCoachAttendedVisitByUserId({
      userId: practitionerId,
      visitType: 'pQASiteVisits',
      followUpType: 'pqa_visit_follow_up',
    })
  );
  const lastAttendedVisit = useSelector(
    getLastCoachAttendedVisitByUserId({
      userId: practitionerId,
      visitType: 'pQASiteVisits',
    })
  );

  const isUserEnableToStartPqaVisit = timeline?.prePQASiteVisits?.every(
    (item) => item?.attended
  );

  const pqaVisits =
    timeline?.pQASiteVisits?.filter(
      (item) => item?.visitType?.name !== visitTypes.pqa.followUp.name
    ) ?? [];
  const isLastAttendedPqaVisit =
    pqaVisits?.filter((item) => item?.attended)?.length === maxNumberOfVisits;

  const newPqaVisit = timeline?.pQASiteVisits?.find(
    (item) =>
      !item?.attended && item?.visitType?.name !== visitTypes.pqa.followUp.name
  );

  const pqaRatings =
    timeline?.pQARatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.pqa.followUp.name
    ) ?? [];

  const pqaRating1 = pqaRatings?.[0];
  const pqaRating2 = pqaRatings?.[1];
  const pqaRating3 = pqaRatings?.[2];

  // INFO: The user can start the follow-up after 14 days, but if it's the last visit (third one), this number changes to 60 days
  const currentFollowUpDeadline = pqaRating3?.overallRating
    ? followUpDeadline.lastVisit
    : followUpDeadline.default;
  const isPQAFollowUpDeadline =
    addDays(
      new Date(lastAttendedPqaVisit?.insertedDate),
      currentFollowUpDeadline
    ) >= new Date();

  const isFirstVisit = timeline?.pQASiteVisits?.length === 1;
  const isPQAFollowUp =
    !isFirstVisit &&
    !!newPqaVisit &&
    !isLastAttendedPqaVisit &&
    !lastAttendedVisit?.visitType?.name?.includes(visitTypes.pqa.followUp.name);

  const mergedVisits = timeline?.pQASiteVisits
    ? [
        ...(isFirstVisit
          ? timeline.pQASiteVisits
          : timeline.pQASiteVisits.filter((item) => item?.attended)),
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
        ...(!isFirstVisit && newPqaVisit && !isPQAFollowUp
          ? [newPqaVisit]
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
    if (item?.id === pqaRating3?.linkedVisitId) {
      return pqaRating3;
    } else if (item?.id === pqaRating2?.linkedVisitId) {
      return pqaRating2;
    } else {
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
    if (!!currentVisit?.eventId) {
      return 'Scheduled ';
    }

    if (!item?.attended) {
      return 'By ';
    }

    return '';
  };

  const getButtonText = (item: Maybe<Visit>) => {
    if (!currentVisit?.eventId) {
      return 'Schedule';
    }
    return 'Start';
  };

  const getButtonIcon = (item: Maybe<Visit>) => {
    if (!currentVisit?.eventId) {
      return 'CalendarIcon';
    }
    return 'ArrowCircleRightIcon';
  };

  const onClick = (options: ScheduleProps) => {
    if (!currentVisit?.eventId) {
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
              color={'textDark'}
              className="w-6/12 font-bold"
              text={item?.visitType?.description || ''}
            />
            {((item?.id === currentVisit?.id && !item?.attended) ||
              (item?.visitType?.name === visitTypes.pqa.followUp.name &&
                item.attended === false) ||
              (item?.id === newPqaVisitId && !item.attended)) &&
              isUserEnableToStartPqaVisit && (
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
                      visitEventId: currentVisit?.eventId,
                      eventType: 'First PQA',
                    })
                  }
                />
              )}
          </div>
          <Typography
            type="body"
            // TODO: add schedule integration
            color={
              item?.visitType?.name === visitTypes.pqa.followUp.name &&
              !isPQAFollowUpDeadline &&
              !item.attended
                ? 'errorMain'
                : getStepType('Success')?.color || 'textMid'
            }
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
