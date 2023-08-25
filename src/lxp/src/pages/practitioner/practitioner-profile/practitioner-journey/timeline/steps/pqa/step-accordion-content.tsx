import { Visit, Maybe } from '@ecdlink/graphql';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import { getRatingData } from '@/pages/coach/coach-practitioner-journey/timeline/utils';
import { visitTypes } from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import { dateOptions, getStepType } from '../../utils';
import { ViewEvent } from '../../timeline-steps';

interface PQAVisitsProps {
  isLoading: boolean;
  currentVisit: Maybe<Visit>;
  practitionerId: string;
  onView: (event: ViewEvent) => void;
}

export const PQAVisits = ({
  isLoading,
  practitionerId,
  onView,
}: PQAVisitsProps) => {
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );

  const attendedPqaVisits = timeline?.pQASiteVisits?.filter(
    (item) => !!item?.attended
  );

  const pqaRatings =
    timeline?.pQARatings?.filter(
      (item) => item?.visitTypeName !== visitTypes.pqa.followUp.name
    ) ?? [];

  const pqaRating1 = pqaRatings?.[0];
  const pqaRating2 = pqaRatings?.[1];
  const pqaRating3 = pqaRatings?.[2];

  const sortedVisits = attendedPqaVisits?.sort((a, b) => {
    if (!a?.actualVisitDate && !b?.actualVisitDate) {
      return 0;
    } else if (!a?.actualVisitDate) {
      return 1;
    } else if (!b?.actualVisitDate) {
      return -1;
    }

    return (
      new Date(a.actualVisitDate).getTime() -
      new Date(b.actualVisitDate).getTime()
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
              !!item?.actualVisitDate
                ? `${new Date(item.actualVisitDate).toLocaleDateString(
                    'en-ZA',
                    dateOptions
                  )}`
                : ''
            }
          />
        </div>
      ))}
    </>
  );
};
