import { Visit, Maybe } from '@ecdlink/graphql';
import { dateOptions, getStepType } from '../timeline-steps';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import {
  getCurrentReAccreditationRatingByUserId,
  getLastCoachAttendedFollowUpVisitByUserId,
  getPractitionerTimelineByIdSelector,
} from '@/store/pqa/pqa.selectors';
import { visitTypes } from '../../coach-practitioner-journey.types';
import { addDays } from 'date-fns';
import { followUpDeadline, getRatingData } from '../utils';

interface ReAccreditationVisitsProps {
  isLoading: boolean;
  currentVisit: Maybe<Visit>;
  practitionerId: string;
  currentVisitEventId: string | undefined;
  isOnline: boolean;
  onScheduleOrStart: (visit: Visit, visitEventId?: string) => void;
}

export const newReAccreditationFollowUpId = 'new-re-accreditation-follow-up';

export const ReAccreditationVisits = ({
  currentVisit,
  practitionerId,
  currentVisitEventId,
  onScheduleOrStart,
}: ReAccreditationVisitsProps) => {
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );
  const currentReAccreditationRating = useSelector(
    getCurrentReAccreditationRatingByUserId(practitionerId)
  );
  const lastAttendedReAccreditationFollowUpVisit = useSelector(
    getLastCoachAttendedFollowUpVisitByUserId(
      practitionerId,
      're_accreditation_follow_up'
    )
  );

  const rating1 = timeline?.reAccreditationRating1;
  const rating2 = timeline?.reAccreditationRating2;
  const rating3 = timeline?.reAccreditationRating3;

  // INFO: The user can start the follow-up after 14 days, but if it's the last visit (third one), this number changes to 60 days
  const currentFollowUpDeadline = rating3?.overallRating
    ? followUpDeadline.lastVisit
    : followUpDeadline.default;
  const isReAccreditationFollowUpDeadline =
    addDays(
      new Date(lastAttendedReAccreditationFollowUpVisit?.insertedDate),
      currentFollowUpDeadline
    ) <= new Date();
  const isReAccreditationFollowUp =
    currentReAccreditationRating.rating?.overallRating &&
    !lastAttendedReAccreditationFollowUpVisit?.visitType?.name?.includes(
      visitTypes.reaccreditation.third.name
    );

  const mergedVisits = timeline?.reAccreditationVisits
    ? [
        ...timeline.reAccreditationVisits,
        ...(isReAccreditationFollowUp
          ? [
              {
                id: newReAccreditationFollowUpId,
                visitType: {
                  description: `Follow-up visit ${currentReAccreditationRating.visitNumber}`,
                  name: visitTypes.reaccreditation.followUp.name,
                },
                plannedVisitDate: addDays(
                  new Date(
                    lastAttendedReAccreditationFollowUpVisit?.insertedDate
                  ),
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
      case visitTypes.reaccreditation.third.name:
        return rating3;
      case visitTypes.reaccreditation.second.name:
        return rating2;
      default:
        return rating1;
    }
  };

  const renderIcon = (item: Maybe<Visit>) => {
    if (
      item?.attended &&
      !item.visitType?.name?.includes(visitTypes.reaccreditation.followUp.name)
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
              (item?.visitType?.name ===
                visitTypes.reaccreditation.followUp.name &&
                item.attended === false &&
                isReAccreditationFollowUpDeadline)) && (
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
                ? `${getSubTitleText(item)}${new Date(
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
