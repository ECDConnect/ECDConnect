import { UserPointsAcitivtyDto } from '@ecdlink/core';
import { Divider, PointsDetailsCard, Typography } from '@ecdlink/ui';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { format } from 'date-fns';

export const PointsMonthSummary = ({
  points,
}: {
  points: UserPointsAcitivtyDto[];
}) => {
  const sum = points.reduce((acc, curr) => acc + curr.pointsTotal, 0);

  const sortedPoints = points.sort((a, b) => b.pointsTotal - a.pointsTotal);

  return (
    <>
      <Divider dividerType="dashed" className="mt-6 mb-4" />
      <Typography
        type="h4"
        color="textDark"
        text={format(
          new Date(points?.[0]?.year, points?.[0]?.month - 1),
          'MMMM'
        )}
      />
      <Typography
        type="body"
        color="textMid"
        className="mb-4"
        text={`${sum} points`}
      />
      {sortedPoints?.map((item, index) => (
        <PointsDetailsCard
          key={item.pointsActivityId + index}
          pointsEarned={item?.pointsTotal}
          activityCount={item?.timesScored}
          title={item?.activityName}
          size="medium"
          className="mb-1"
          colour="uiBg"
          badgeTextColour="white"
          badgeImage={
            <Badge
              className="absolute z-0 h-full w-full"
              fill={'var(--secondary)'}
            />
          }
        />
      ))}
    </>
  );
};
