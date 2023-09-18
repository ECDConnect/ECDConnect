import { pointsSelectors } from '@/store/points';
import { Divider, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { RootState } from '@/store/types';
import { PointsDetailsCard } from '@/pages/dashboard/components/points-details-card/points-details-card';

export type PointsMonthSummary = {
  month: number;
};

export const PointsMonthSummary: React.FC<PointsMonthSummary> = ({ month }) => {
  const date = new Date(new Date().getFullYear(), month, 1);
  const pointsEarnedForMonth = useSelector((state: RootState) =>
    pointsSelectors
      .getPointsSummaryWithLibrary(state, date)
      .filter((x) => x.pointsTotal > 0)
  );

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
          <PointsDetailsCard
            pointsEarned={pointsLibraryScore.pointsTotal}
            activityCount={12} // TODO - replace with actual value once available
            description={pointsLibraryScore.subActivity || 'Unknown'}
          />
        );
      })}
    </>
  );
};
