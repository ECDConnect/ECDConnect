import { classNames } from '../../../utils';
import Typography from '../../typography/typography';
import { PointsDetailsCardProps } from './points-details-card.types';

export const PointsDetailsCard: React.FC<PointsDetailsCardProps> = ({
  id,
  pointsEarned,
  activityCount,
  title,
  description,
  size = 'medium',
  colour = 'uiBg',
  className,
  isShare,
  badgeImage,
  badgeTextColour = 'white',
  textColour = 'textMid',
  hideActivityCount,
}) => {
  return (
    <div
      id={id}
      className={classNames(
        className,
        `bg-${colour} rounded-10 flex w-full flex-row items-center p-5 pl-8`
      )}
    >
      {!hideActivityCount && (
        <p
          className={`text-center ${size === 'large' ? 'text-6xl' : 'text-4xl'}
        ${isShare ? 'mb-11' : ''}
        font-semibold text-${textColour}`}
        >
          {activityCount}
        </p>
      )}
      <div
        className={`${hideActivityCount ? '' : 'ml-8'} ${
          isShare ? 'mb-5' : ''
        }`}
      >
        <Typography
          type={size === 'large' ? 'h1' : 'h4'}
          text={title}
          color={textColour}
        />
        <Typography type="help" color={textColour} text={description} />
      </div>
      <div
        className={`relative ml-auto flex ${
          size === 'large' ? 'h-16 w-16' : 'h-11 w-11'
        } items-center justify-center`}
      >
        {badgeImage}
        <Typography
          className={`relative z-10 ${isShare ? 'mb-4' : ''}`}
          color={badgeTextColour}
          type="body"
          text={String(pointsEarned)}
        />
      </div>
    </div>
  );
};
