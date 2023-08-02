import { Visit, Maybe, PqaRating } from '@ecdlink/graphql';
import { ScheduleProps, dateOptions, getStepType } from '../timeline-steps';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import {
  getCurrentReAccreditationRatingByUserId,
  getLastCoachAttendedVisitByUserId,
  getPractitionerTimelineByIdSelector,
} from '@/store/pqa/pqa.selectors';
import {
  maxNumberOfVisits,
  visitTypes,
} from '../../coach-practitioner-journey.types';
import { addDays } from 'date-fns';
import { followUpDeadline, getRatingData } from '../utils';
import { chunkArray } from '@ecdlink/core';

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
  const lastAttendedVisit = useSelector(
    getLastCoachAttendedVisitByUserId({
      userId: practitionerId,
      visitType: `reAccreditationVisits`,
    })
  );

  // All years
  const filteredReAccreditationRatings =
    timeline?.reAccreditationRatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.reaccreditation.followUp.name
    ) ?? [];
  const subdividedReAccreditationRatings = chunkArray<Maybe<PqaRating>>(
    filteredReAccreditationRatings,
    maxNumberOfVisits
  );
  const reAccreditationRatingsFromCurrentYear =
    subdividedReAccreditationRatings?.[
      subdividedReAccreditationRatings.length - 1
    ];

  const rating1 = reAccreditationRatingsFromCurrentYear?.[0];
  const rating2 = reAccreditationRatingsFromCurrentYear?.[1];
  const rating3 = reAccreditationRatingsFromCurrentYear?.[2];

  const filteredReAccreditationVisits =
    timeline?.reAccreditationVisits?.filter(
      (item) =>
        item?.visitType?.name !== visitTypes.reaccreditation.followUp.name
    ) ?? [];
  const subdividedReAccreditationVisits = chunkArray<Maybe<Visit>>(
    filteredReAccreditationVisits,
    maxNumberOfVisits
  );
  const reAccreditationVisitsFromCurrentYear =
    subdividedReAccreditationVisits?.[filteredReAccreditationVisits.length - 1];

  // INFO: The user can start the follow-up after 14 days, but if it's the last visit (third one), this number changes to 60 days
  const currentFollowUpDeadline = rating3?.overallRating
    ? followUpDeadline.lastVisit
    : followUpDeadline.default;

  const newReAccreditationVisit = timeline?.reAccreditationVisits?.find(
    (item) =>
      !item?.attended &&
      item?.visitType?.name !== visitTypes.reaccreditation.followUp.name
  );

  const isReAccreditationFollowUpDeadline =
    addDays(
      new Date(lastAttendedReAccreditationVisit?.insertedDate),
      currentFollowUpDeadline
    ) <= new Date();
  const isFirstVisit = reAccreditationVisitsFromCurrentYear?.length === 1;
  const isReAccreditationFollowUp =
    !isFirstVisit &&
    !!newReAccreditationVisit &&
    !lastAttendedReAccreditationVisit?.visitType?.name?.includes(
      visitTypes.reaccreditation.third.name
    ) &&
    !lastAttendedVisit?.visitType?.name?.includes(
      visitTypes.reaccreditation.followUp.name
    );

  const mergedVisits = timeline?.reAccreditationVisits
    ? [
        ...(isFirstVisit
          ? timeline.reAccreditationVisits
          : timeline.reAccreditationVisits.filter((item) => item?.attended)),
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
        ...(!isFirstVisit && newReAccreditationVisit
          ? [newReAccreditationVisit]
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
