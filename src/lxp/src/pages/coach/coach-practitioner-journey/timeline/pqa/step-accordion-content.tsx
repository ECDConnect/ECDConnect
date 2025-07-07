import { Visit, Maybe } from '@ecdlink/graphql';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import {
  getRatingData,
  getScheduleOrStartButtonIcon,
  getScheduleOrStartButtonText,
  getScheduleOrStartSubTitleText,
  sortVisits,
} from '../utils';
import { visitTypes } from '../../coach-practitioner-journey.types';
import { ScheduleOrStartProps, dateOptions } from '../timeline-steps';

interface PQAVisitsProps {
  isLoading: boolean;
  currentVisit: Maybe<Visit>;
  pQASiteVisits: Maybe<Visit>[];
  practitionerId: string;
  isOnline: boolean;
  onStart: (visitName: string) => void;
  onScheduleOrStart: (schedule: ScheduleOrStartProps) => void;
}

export const newPqaFollowUpId = 'new-pqa-follow-up';
export const newPqaVisitId = 'new-pqa-visit';

export const PQAVisits = ({
  currentVisit,
  pQASiteVisits,
  practitionerId,
  onStart,
  onScheduleOrStart,
}: PQAVisitsProps) => {
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );

  const isUserEnableToStartPqaVisit = timeline?.prePQASiteVisits?.every(
    (item) => item?.attended
  );

  const nextPqaVisit = pQASiteVisits?.filter((item) => !item?.attended).shift();

  const pqaRatings =
    timeline?.pQARatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.pqa.followUp.name
    ) ?? [];

  const pqaRating1 = pqaRatings?.[0];
  const pqaRating2 = pqaRatings?.[1];
  const pqaRating3 = pqaRatings?.[2];

  const isFirstVisit = pQASiteVisits?.length === 1;

  const mergedVisits = pQASiteVisits
    ? [
        ...(isFirstVisit
          ? pQASiteVisits
          : pQASiteVisits.filter((item) => item?.attended)),
        ...(!isFirstVisit && nextPqaVisit ? [nextPqaVisit] : []),
      ]
    : [];

  const sortedVisits = sortVisits(mergedVisits);

  const getVisitRating = (item: Maybe<Visit>) => {
    if (item?.id === pqaRating3?.visitId) {
      return pqaRating3;
    } else if (item?.id === pqaRating2?.visitId) {
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
                  text={getScheduleOrStartButtonText(item)}
                  iconPosition="start"
                  icon={getScheduleOrStartButtonIcon(item)}
                  onClick={() =>
                    onClick({
                      visit: item as Visit,
                      visitTypeName: item?.visitType?.name || '',
                      visitEventId: currentVisit?.eventId,
                      eventType:
                        item?.visitType?.name === visitTypes.pqa.firstPQA.name
                          ? visitTypes.pqa.firstPQA.eventType
                          : visitTypes.pqa.followUp.eventType,
                      scheduleStartText:
                        item?.visitType?.name === visitTypes.pqa.firstPQA.name
                          ? visitTypes.pqa.firstPQA.scheduleStartText
                          : visitTypes.pqa.followUp.scheduleStartText,
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
