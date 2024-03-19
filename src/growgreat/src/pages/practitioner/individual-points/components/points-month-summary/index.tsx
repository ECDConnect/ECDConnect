import { Divider, PointsDetailsCard, Typography } from '@ecdlink/ui';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';

export const PointsMonthSummary = () => {
  const dummyPoints = [1, 2, 3];

  return (
    <>
      <Divider dividerType="dashed" className="mt-6 mb-4" />
      <Typography type="h4" color="textDark" text={`{Month}`} />
      <Typography
        type="body"
        color="textMid"
        className="mb-4"
        text={`{points} points`}
      />
      {dummyPoints.map((item, index) => (
        <PointsDetailsCard
          pointsEarned={2}
          activityCount={5}
          title={'Lorem Ipsum'}
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
