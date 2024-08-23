import { ProgressBar } from '../../progress-bar';
import { RoundIcon } from '../../round-icon/round-icon';
import Typography from '../../typography/typography';
import * as styles from './points-progress-card.styles';
import { PointsProgressCardProps } from './points-progress-card.types';

export const PointsProgressCard: React.FC<PointsProgressCardProps> = ({
  currentPoints,
  maxPoints,
  description,
  badgeImage,
  icon = 'PencilIcon',
  imageUrl,
  barColour = 'primary',
  isYearView,
  hideProgressBar,
}) => {
  const percentageScore = maxPoints ? (currentPoints / maxPoints) * 100 : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {isYearView ? (
          <Typography
            type="unspecified"
            text={String(currentPoints)}
            className="ml-2 pt-2 text-4xl font-semibold"
            fontSize="72"
          />
        ) : (
          <RoundIcon
            hexBackgroundColor="tertiary"
            iconColor="white"
            backgroundColor="tertiary"
            icon={icon}
            imageUrl={imageUrl}
            size={{ w: '12', h: '12' }}
          />
        )}
        <Typography
          type="h3"
          text={description}
          className="text-wrap ml-5 w-8/12 pt-2"
        />
        <div className="ml-auto">
          <div
            className="h-14 w-14 p-2"
            style={{
              position: 'relative',
              // overflow: 'hidden',
            }}
          >
            {badgeImage}
            <h1
              className="text-2x1 absolute top-0 bottom-0 left-0 right-0 m-auto text-center font-semibold text-white"
              style={{
                height: 'fit-content',
              }}
            >
              {maxPoints}
            </h1>
          </div>
        </div>
      </div>
      {!hideProgressBar && (
        <div className="h-4 w-full">
          <ProgressBar
            className="h-2"
            label=""
            subLabel=""
            value={percentageScore}
            primaryColour={barColour}
            secondaryColour={'white'}
          />
        </div>
      )}
    </div>
  );
};
