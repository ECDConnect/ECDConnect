import { Visit, Maybe, PqaRating } from '@ecdlink/graphql';
import { ScheduleProps, dateOptions } from '../timeline-steps';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import {
  maxNumberOfVisits,
  visitTypes,
} from '../../coach-practitioner-journey.types';
import { getRatingData, isDateWithinThreeMonths } from '../utils';
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

  const isUserEnableToStartPqaVisit = timeline?.prePQASiteVisits?.every(
    (item) => item?.attended
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

  const nextReAccreditationVisit = timeline?.reAccreditationVisits
    ?.filter((item) => !item?.attended)
    .shift();

  const isFirstVisit = reAccreditationVisitsFromCurrentYear?.length === 1;

  const mergedVisits = timeline?.reAccreditationVisits
    ? [
        ...(isFirstVisit
          ? timeline.reAccreditationVisits
          : timeline.reAccreditationVisits.filter((item) => item?.attended)),
        ...(!isFirstVisit && nextReAccreditationVisit
          ? [nextReAccreditationVisit]
          : []),
      ]
    : [];

  const sortedVisits = mergedVisits.sort((a, b) => {
    if (!a?.attended && !b?.attended) {
      return 0;
    } else if (!a?.attended) {
      return 1;
    } else if (!b?.attended) {
      return -1;
    }

    return (
      new Date(a.actualVisitDate).getTime() -
      new Date(b.actualVisitDate).getTime()
    );
  });

  const getVisitRating = (item: Maybe<Visit>) => {
    if (item?.id === rating3?.linkedVisitId) {
      return rating3;
    } else if (item?.id === rating2?.linkedVisitId) {
      return rating2;
    } else {
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
                item.attended === false) ||
              (item?.id === newReAccreditationVisitId && !item.attended)) &&
              isUserEnableToStartPqaVisit &&
              isDateWithinThreeMonths(item?.plannedVisitDate) && (
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
            color={
              !item?.attended && new Date(item?.plannedVisitDate) < new Date()
                ? 'errorMain'
                : 'textMid'
            }
            text={
              !!item?.plannedVisitDate
                ? `${getSubTitleText(item)}${new Date(
                    item.attended ? item.actualVisitDate : item.plannedVisitDate
                  ).toLocaleDateString('en-ZA', dateOptions)}`
                : ''
            }
          />
        </div>
      ))}
    </>
  );
};
