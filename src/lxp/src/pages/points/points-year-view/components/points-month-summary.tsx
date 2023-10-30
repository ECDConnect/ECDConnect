import { pointsSelectors } from '@/store/points';
import { Divider, PointsDetailsCard, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';

export type PointsMonthSummaryProps = {
  month: number;
};

export const PointsMonthSummary: React.FC<PointsMonthSummaryProps> = ({
  month,
}) => {
  const date = new Date(new Date().getFullYear(), month, 1);
  const pointsEarnedForMonth = useSelector(
    pointsSelectors.getPointsSummaryWithLibrary(date)
  ).filter((x) => x.pointsTotal > 0);

  const pointsTotal = pointsEarnedForMonth.reduce(
    (total, current) => (total += current.pointsTotal),
    0
  );

  return (
    <>
      <Divider dividerType="dashed" className="mt-3 mb-3" />
      <Typography type={'h1'} color="black" text={format(date, 'MMMM')} />
      <Typography type={'h2'} color="black" text={`${pointsTotal} points`} />
      {pointsEarnedForMonth.map((pointsLibraryScore) => {
        return (
          <div key={pointsLibraryScore.pointsLibraryId}>
            <PointsDetailsCard
              pointsEarned={pointsLibraryScore.pointsTotal}
              activityCount={pointsLibraryScore.timesScored}
              title={pointsLibraryScore.subActivity || 'Unknown'}
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
