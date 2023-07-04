import { Visit, Maybe } from '@ecdlink/graphql';
import { dateOptions, getStepType } from './timeline-steps';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import {
  getCurrentPQaRatingByUserId,
  getLastCoachAttendedVisitByUserId,
  getPractitionerTimelineByIdSelector,
} from '@/store/pqa/pqa.selectors';
import { visitTypes } from '../coach-practitioner-journey.types';
import { addDays } from 'date-fns';

interface PQAVisitsProps {
  isLoading: boolean;
  currentVisit: Maybe<Visit>;
  practitionerId: string;
  currentVisitEventId: string | undefined;
  isOnline: boolean;
  onScheduleOrStart: (visit: Visit, visitEventId?: string) => void;
}

export const newFollowUpId = 'new-follow-up';
export const followUpDeadline = { default: 14, lastVisit: 60 };

export const getRatingData = (overallRatingColor?: Maybe<string>) => {
  switch (overallRatingColor) {
    case 'Error':
      return {
        text: 'Red rating',
        icon: <span className="text-errorMain text-xl">■</span>,
      };
    case 'Warning':
      return {
        text: 'Orange rating',
        icon: <span className="text-alertMain text-xl">▲</span>,
      };
    default:
      return {
        text: 'Green rating',
        icon: <span className="text-successMain text-xl">●</span>,
      };
  }
};

export const PQAVisits = ({
  currentVisit,
  practitionerId,
  currentVisitEventId,
  onScheduleOrStart,
}: PQAVisitsProps) => {
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );
  const currentPqaRating = useSelector(
    getCurrentPQaRatingByUserId(practitionerId)
  );
  const lastAttendedVisit = useSelector(
    getLastCoachAttendedVisitByUserId(practitionerId)
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
      new Date(lastAttendedVisit?.insertedDate),
      currentFollowUpDeadline
    ) <= new Date();
  const isPQAFollowUp =
    currentPqaRating.rating?.overallRating &&
    !lastAttendedVisit?.visitType?.name?.includes(visitTypes.pqa.thirdPQA.name);

  const mergedVisits = timeline?.pQASiteVisits
    ? [
        ...timeline.pQASiteVisits,
        ...(isPQAFollowUp
          ? [
              {
                id: newFollowUpId,
                visitType: {
                  description: `Follow-up visit ${currentPqaRating.visitNumber}`,
                  name: visitTypes.pqa.followUp.name,
                },
                plannedVisitDate: addDays(
                  new Date(lastAttendedVisit?.insertedDate),
                  currentFollowUpDeadline
                ),
                attended: false,
              } as Maybe<Visit>,
            ]
          : []),
      ]
    : [];

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

  return (
    <>
      {mergedVisits.map((item) => (
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
                isPQAFollowUpDeadline)) && (
              <Button
                style={{
                  position: 'absolute',
                  right: -36,
                }}
                className="z-50 w-32"
                textColor="primary"
                type="outlined"
                color="primary"
                text="Schedule"
                iconPosition="start"
                icon="CalendarIcon"
                onClick={() =>
                  onScheduleOrStart(item as Visit, currentVisitEventId)
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
                ? `${!item.attended ? 'By ' : ''}${new Date(
                    item.plannedVisitDate
                  ).toLocaleDateString('en-ZA', dateOptions)}`
                : ''
            }
          />
        </div>
      ))}
    </>
  );
};
