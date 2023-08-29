import { Visit, Maybe, PqaRating } from '@ecdlink/graphql';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import { dateOptions, getStepType } from '../../utils';
import {
  maxNumberOfVisits,
  visitTypes,
} from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import {
  getRatingData,
  sortVisits,
} from '@/pages/coach/coach-practitioner-journey/timeline/utils';
import { ViewEvent } from '../../timeline-steps';
import { chunkArray } from '@ecdlink/core';

interface ReAccreditationVisitsProps {
  isLoading: boolean;
  practitionerId: string;
  reAccreditationVisits: Maybe<Visit>[];
  onView: (event: ViewEvent) => void;
}

export const ReAccreditationVisits = ({
  practitionerId,
  isLoading,
  reAccreditationVisits,
  onView,
}: ReAccreditationVisitsProps) => {
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
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

  const sortedVisits = sortVisits(reAccreditationVisits);

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
                      visitTypes.reaccreditation.followUp.name
                    )
                      ? 're-accreditation-follow-up-visit'
                      : 're-accreditation',
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
                ? new Date(
                    item.attended ? item.actualVisitDate : item.plannedVisitDate
                  ).toLocaleDateString('en-ZA', dateOptions)
                : ''
            }
          />
        </div>
      ))}
    </>
  );
};
