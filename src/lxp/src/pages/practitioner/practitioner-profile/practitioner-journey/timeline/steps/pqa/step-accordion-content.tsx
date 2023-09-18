import { Visit, Maybe } from '@ecdlink/graphql';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import {
  getRatingData,
  sortVisits,
} from '@/pages/coach/coach-practitioner-journey/timeline/utils';
import { visitTypes } from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import { dateOptions, getStepType } from '../../utils';
import { ViewEvent } from '../../timeline-steps';

interface PQAVisitsProps {
  isLoading: boolean;
  pQASiteVisits: Maybe<Visit>[];
  practitionerId: string;
  onView: (event: ViewEvent) => void;
}

export const PQAVisits = ({
  isLoading,
  practitionerId,
  pQASiteVisits,
  onView,
}: PQAVisitsProps) => {
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );

  const pqaRatings =
    timeline?.pQARatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.pqa.followUp.name
    ) ?? [];

  const pqaRating1 = pqaRatings?.[0];
  const pqaRating2 = pqaRatings?.[1];
  const pqaRating3 = pqaRatings?.[2];

  const sortedVisits = sortVisits(pQASiteVisits);

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

  return (
    <>
      {sortedVisits?.map((item) => (
        <div className="my-4" key={item?.id}>
          <div className="relative flex items-center gap-1">
            {renderIcon(item)}
            <Typography
              type="body"
              color="textDark"
              className="w-6/12 font-bold"
              text={item?.visitType?.description || ''}
            />
            {item?.hasAnswerData && (
              <Button
                style={{
                  position: 'absolute',
                  right: -36,
                }}
                className="z-50 w-32"
                type="filled"
                color="secondaryAccent2"
                textColor="secondary"
                text="View"
                isLoading={isLoading}
                disabled={isLoading}
                onClick={() =>
                  onView({
                    visit: item,
                    visitType: item?.visitType?.name?.includes(
                      visitTypes.pqa.followUp.name
                    )
                      ? 'follow-up-visit'
                      : 'pqa',
                  })
                }
              />
            )}
          </div>
          <Typography
            type="body"
            color={getStepType(String('Success'))?.color || 'textMid'}
            text={
              !!item?.plannedVisitDate
                ? `${new Date(
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
