import { ProgressBar, RoundIcon, Typography } from '@ecdlink/ui';
import * as styles from './points-progress-card.styles';
import { PointsProgressCardProps } from './points-progress-card.types';
import { ReactComponent as BadgePurple } from '@ecdlink/ui/src/assets/badge/badge_purple.svg';

export const PointsProgressCard: React.FC<PointsProgressCardProps> = ({
  currentPoints,
  maxPoints,
  description,
}) => {
  const percentageScore = (currentPoints / maxPoints) * 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <RoundIcon
          hexBackgroundColor="tertiary"
          iconColor="white"
          backgroundColor="tertiary"
          icon="PencilIcon"
          size={{ w: '16', h: '16' }}
        />
        <Typography type="h2" text={description} className="ml-5 pt-2" />
        <div
          className="h-16 w-16 p-2"
          style={{
            position: 'relative',
            overflow: 'hidden',
            marginLeft: 'auto',
          }}
        >
          <BadgePurple
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          <h1
            className="text-2x1 font-semibold text-white"
            style={{
              textAlign: 'center',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              height: 'fit-content',
              margin: 'auto',
            }}
          >
            {maxPoints}
          </h1>
        </div>
      </div>
      <div className="h-4 w-full">
        <ProgressBar
          className="h-2"
          label=""
          subLabel=""
          value={percentageScore}
          primaryColour={'primary'}
          secondaryColour={'uiLight'}
        />
      </div>
    </div>
  );
};
