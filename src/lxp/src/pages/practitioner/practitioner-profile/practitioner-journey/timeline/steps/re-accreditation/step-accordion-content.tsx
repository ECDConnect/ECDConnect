import { Visit, Maybe } from '@ecdlink/graphql';
import { CalendarIcon } from '@heroicons/react/solid';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import { dateOptions, getStepType } from '../../utils';
import { visitTypes } from '@/pages/coach/coach-practitioner-journey/coach-practitioner-journey.types';
import { getRatingData } from '@/pages/coach/coach-practitioner-journey/timeline/utils';
import { ViewEvent } from '../../timeline-steps';

interface ReAccreditationVisitsProps {
  isLoading: boolean;
  practitionerId: string;
  onView: (event: ViewEvent) => void;
}

export const newReAccreditationFollowUpId = 'new-re-accreditation-follow-up';
export const newReAccreditationVisitId = 'new-re-accreditation';

export const ReAccreditationVisits = ({
  practitionerId,
  isLoading,
  onView,
}: ReAccreditationVisitsProps) => {
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );

  const attendedReAccreditationVisits = timeline?.reAccreditationVisits?.filter(
    (item) => !!item?.attended
  );

  const rating1 = timeline?.reAccreditationRating1;
  const rating2 = timeline?.reAccreditationRating2;
  const rating3 = timeline?.reAccreditationRating3;

  const sortedVisits = attendedReAccreditationVisits?.sort((a, b) => {
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
                onView({ visit: item, visitType: 're-accreditation' })
              }
            />
          </div>
          <Typography
            type="body"
            color={getStepType(String('Success'))?.color || 'textMid'}
            text={
              !!item?.insertedDate
                ? new Date(item.insertedDate).toLocaleDateString(
                    'en-ZA',
                    dateOptions
                  )
                : ''
            }
          />
        </div>
      ))}
    </>
  );
};
