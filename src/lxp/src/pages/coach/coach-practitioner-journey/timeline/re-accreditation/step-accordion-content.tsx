import { Visit, Maybe, PqaRating } from '@ecdlink/graphql';
import { ScheduleOrStartProps, dateOptions } from '../timeline-steps';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import {
  maxNumberOfVisits,
  visitTypes,
} from '../../coach-practitioner-journey.types';
import {
  getRatingData,
  getScheduleOrStartButtonIcon,
  getScheduleOrStartButtonText,
  getScheduleOrStartSubTitleText,
  isDateWithinThreeMonths,
} from '../utils';
import { chunkArray } from '@ecdlink/core';

interface ReAccreditationVisitsProps {
  isLoading: boolean;
  currentVisit: Maybe<Visit>;
  reAccreditationVisits: Maybe<Visit>[];
  practitionerId: string;
  isOnline: boolean;
  onStart: (visitName: string) => void;
  onScheduleOrStart: (schedule: ScheduleOrStartProps) => void;
}

export const newReAccreditationFollowUpId = 'new-re-accreditation-follow-up';
export const newReAccreditationVisitId = 'new-re-accreditation';

export const ReAccreditationVisits = ({
  currentVisit,
  reAccreditationVisits,
  practitionerId,
  onStart,
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
    reAccreditationVisits?.filter(
      (item) =>
        item?.visitType?.name !== visitTypes.reaccreditation.followUp.name
    ) ?? [];
  const subdividedReAccreditationVisits = chunkArray<Maybe<Visit>>(
    filteredReAccreditationVisits,
    maxNumberOfVisits
  );
  const reAccreditationVisitsFromCurrentYear =
    subdividedReAccreditationVisits?.[filteredReAccreditationVisits.length - 1];

  const nextReAccreditationVisit = reAccreditationVisits
    ?.filter((item) => !item?.attended)
    .shift();

  const isFirstVisit = reAccreditationVisitsFromCurrentYear?.length === 1;

  const mergedVisits = reAccreditationVisits
    ? [
        ...(isFirstVisit
          ? reAccreditationVisits
          : reAccreditationVisits.filter((item) => item?.attended)),
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
    if (item?.id === rating3?.visitId) {
      return rating3;
    } else if (item?.id === rating2?.visitId) {
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

  const onClick = (options: ScheduleOrStartProps) => {
    if (!options.visit?.eventId) {
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
                  text={getScheduleOrStartButtonText(item)}
                  iconPosition="start"
                  icon={getScheduleOrStartButtonIcon(item)}
                  onClick={() =>
                    onClick({
                      visit: item as Visit,
                      visitTypeName: item?.visitType?.name || '',
                      visitEventId: currentVisit?.eventId,
                      eventType:
                        item?.visitType?.name ===
                        visitTypes.reaccreditation.first.name
                          ? visitTypes.reaccreditation.first.eventType
                          : visitTypes.reaccreditation.followUp.eventType,
                      scheduleStartText:
                        item?.visitType?.name ===
                        visitTypes.reaccreditation.first.name
                          ? visitTypes.reaccreditation.first.scheduleStartText
                          : visitTypes.reaccreditation.followUp
                              .scheduleStartText,
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
                ? `${getScheduleOrStartSubTitleText(item)}${new Date(
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
