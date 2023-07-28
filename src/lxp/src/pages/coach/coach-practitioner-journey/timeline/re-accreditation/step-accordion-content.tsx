import { Visit, Maybe } from '@ecdlink/graphql';
import { ScheduleProps, dateOptions, getStepType } from '../timeline-steps';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import {
  getCurrentReAccreditationRatingByUserId,
  getLastCoachAttendedFollowUpVisitByUserId,
  getLastCoachAttendedVisitByUserId,
  getPractitionerTimelineByIdSelector,
} from '@/store/pqa/pqa.selectors';
import { visitTypes } from '../../coach-practitioner-journey.types';
import { addDays } from 'date-fns';
import { followUpDeadline, getRatingData } from '../utils';

interface ReAccreditationVisitsProps {
  isLoading: boolean;
  currentVisit: Maybe<Visit>;
  practitionerId: string;
  isOnline: boolean;
  onScheduleOrStart: (schedule: ScheduleProps) => void;
}

export const newReAccreditationFollowUpId = 'new-re-accreditation-follow-up';
export const newReAccreditationVisitId = 'new-re-accreditation';

export const ReAccreditationVisits = ({
  currentVisit,
  practitionerId,
  onScheduleOrStart,
}: ReAccreditationVisitsProps) => {
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );
  const currentReAccreditationRating = useSelector(
    getCurrentReAccreditationRatingByUserId(practitionerId)
  );
  const lastAttendedReAccreditationVisit = useSelector(
    getLastCoachAttendedVisitByUserId({
      userId: practitionerId,
      visitType: `reAccreditationVisits`,
      followUpType: 're_accreditation_follow_up',
    })
  );
  const lastAttendedReAccreditationFollowUpVisit = useSelector(
    getLastCoachAttendedFollowUpVisitByUserId(
      practitionerId,
      'reAccreditationVisits',
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
      new Date(lastAttendedReAccreditationVisit?.insertedDate),
      currentFollowUpDeadline
    ) <= new Date();
  const isNewVisit =
    !rating3?.overallRating &&
    timeline?.reAccreditationVisits?.some(
      (item) =>
        item?.attended &&
        item?.visitType?.name !== visitTypes.reaccreditation.followUp.name
    ) &&
    new Date(lastAttendedReAccreditationFollowUpVisit?.insertedDate) >
      new Date(lastAttendedReAccreditationVisit?.insertedDate);
  const isReAccreditationFollowUp =
    currentReAccreditationRating.rating?.overallRatingColor &&
    currentReAccreditationRating.rating?.overallRatingColor !== 'Success' &&
    !lastAttendedReAccreditationVisit?.visitType?.name?.includes(
      visitTypes.reaccreditation.third.name
    ) &&
    !isNewVisit;

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
                  new Date(lastAttendedReAccreditationVisit?.insertedDate),
                  currentFollowUpDeadline
                ),
                attended: false,
              } as Maybe<Visit>,
            ]
          : []),
        ...(isNewVisit
          ? [
              {
                id: newReAccreditationVisitId,
                visitType: {
                  description: `Annual re-accreditation PQA`,
                  name: visitTypes.reaccreditation.first.name,
                },
                plannedVisitDate:
                  lastAttendedReAccreditationFollowUpVisit?.insertedDate,
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
    if (!!currentVisit?.eventId) {
      return 'Scheduled ';
    }

    if (!item?.attended) {
      return 'By ';
    }

    return '';
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
              (item?.visitType?.name ===
                visitTypes.reaccreditation.followUp.name &&
                item.attended === false &&
                isReAccreditationFollowUpDeadline) ||
              (item?.id === newReAccreditationVisitId && !item.attended)) && (
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
                  onScheduleOrStart({
                    visit: item as Visit,
                    visitEventId: currentVisit?.eventId,
                    eventType: 'ReAccreditation',
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
