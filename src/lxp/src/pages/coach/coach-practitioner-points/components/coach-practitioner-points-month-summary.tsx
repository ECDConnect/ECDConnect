import { Divider, PointsDetailsCard, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';

export type PointsMonthSummaryProps = {
  month: number;
  userId: string;
};

export const CoachPractitionerPointsMonthSummary: React.FC<
  PointsMonthSummaryProps
> = ({ userId: practitionerId, month }) => {
  const date = new Date(new Date().getFullYear(), month, 1);
  const pointsEarnedForMonth = useSelector(
    practitionerForCoachSelectors.getPointsSummaryWithLibraryForPractitioner(
      practitionerId,
      date
    )
  )?.filter((x) => x.pointsTotal > 0);

  const pointsTotal = pointsEarnedForMonth?.reduce(
    (total, current) => (total += current.pointsTotal),
    0
  );

  return (
    <>
      <Divider dividerType="dashed" className="mt-3 mb-3" />
      <Typography type={'h1'} color="black" text={format(date, 'MMMM')} />
      <Typography type={'h2'} color="black" text={`${pointsTotal} points`} />
      {pointsEarnedForMonth?.map((pointsLibraryScore) => {
        return (
          <div key={pointsLibraryScore.pointsLibraryId} className="mt-3">
            <PointsDetailsCard
              pointsEarned={pointsLibraryScore.pointsTotal}
              activityCount={pointsLibraryScore.timesScored}
              title={pointsLibraryScore.description || 'Unknown'}
              size="large"
              badgeImage={
                <Badge
                  className="absolute z-0 h-full w-full"
                  fill="var(--primary)"
                />
              }
            />
          </div>
        );
      })}
    </>
  );
};
