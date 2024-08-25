import { pointsSelectors } from '@/store/points';
import { Divider, PointsDetailsCard, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { PointsSummaryDto } from '@ecdlink/core';

export type PointsMonthSummaryProps = {
  month: number;
  pointsYearSummary?: any;
};

export const PointsMonthSummary: React.FC<PointsMonthSummaryProps> = ({
  month,
  pointsYearSummary,
}) => {
  const date = new Date(new Date().getFullYear(), month, 1);

  return (
    <>
      <Divider dividerType="dashed" className="mt-3 mb-3" />
      <Typography type={'h4'} color="black" text={format(date, 'MMMM')} />
      <Typography
        type={'body'}
        color="textMid"
        text={`${pointsYearSummary?.monthSummary?.[0]?.total} points`}
      />
      {pointsYearSummary?.pointsYearSummary?.map(
        (pointsLibraryScore: PointsSummaryDto) => {
          return (
            <div key={pointsLibraryScore.pointsLibraryId} className="mt-3">
              <PointsDetailsCard
                pointsEarned={pointsLibraryScore.pointsTotal}
                activityCount={pointsLibraryScore.timesScored}
                title={pointsLibraryScore.description || 'Unknown'}
                size="large"
                badgeImage={
                  <div className="relative mr-4 flex h-11 w-11 items-center justify-center">
                    <Badge
                      className="absolute z-0 h-auto w-auto text-white"
                      fill="var(--secondary)"
                    />
                    <Typography
                      className="relative z-50"
                      color="white"
                      type="h1"
                      text={'ahahahaah'}
                    />
                  </div>
                }
              />
            </div>
          );
        }
      )}
    </>
  );
};
