import { Typography, classNames } from '@ecdlink/ui';
import { PointsDetailsCardProps } from './points-details-card.types';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';

export const PointsDetailsCard: React.FC<PointsDetailsCardProps> = ({
  pointsEarned,
  activityCount,
  title,
  description,
  size = 'medium',
  colour = 'uiBg',
  badgeColour = 'primary',
  className,
}) => {
  return (
    <div
      className={classNames(
        className,
        `bg-${colour} rounded-10 flex w-full flex-row items-center p-5 pl-8`
      )}
    >
      <p
        className={`text-center ${
          size === 'large' ? 'text-6xl' : 'text-4xl'
        } font-semibold text-black`}
      >
        {activityCount}
      </p>
      <div className="ml-8">
        <Typography type={size === 'large' ? 'h1' : 'h4'} text={title} />
        <Typography type="help" color="textMid" text={description} />
      </div>
      <div
        className={`relative ml-auto flex ${
          size === 'large' ? 'h-16 w-16' : 'h-11 w-11'
        } items-center justify-center`}
      >
        <Badge
          className="absolute z-0 h-full w-full"
          fill={`var(--${badgeColour})`}
        />
        <Typography
          className="relative z-10"
          color="white"
          type="body"
          text={String(pointsEarned)}
        />
      </div>
    </div>
  );
};
