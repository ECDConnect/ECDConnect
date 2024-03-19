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
}) => {
  const percentageScore = (currentPoints / maxPoints) * 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <RoundIcon
          hexBackgroundColor="tertiary"
          iconColor="white"
          backgroundColor="tertiary"
          icon={icon}
          imageUrl={imageUrl}
          size={{ w: '12', h: '12' }}
        />
        <Typography type="h3" text={description} className="ml-5 pt-2" />
        <div className="ml-auto">
          <div
            className="h-14 w-14 p-2"
            style={{
              position: 'relative',
              overflow: 'hidden',
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
      <div className="h-4 w-full">
        <ProgressBar
          className="h-2"
          label=""
          subLabel=""
          value={percentageScore}
          primaryColour={barColour}
          secondaryColour={'uiLight'}
        />
      </div>
    </div>
  );
};
