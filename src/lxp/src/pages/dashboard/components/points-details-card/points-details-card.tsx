import { Typography } from '@ecdlink/ui';
import * as styles from './points-details-card.styles';
import { PointsDetailsCardProps } from './points-details-card.types';
import { ReactComponent as BadgePurple } from '@ecdlink/ui/src/assets/badge/badge_purple.svg';

export const PointsDetailsCard: React.FC<PointsDetailsCardProps> = ({
  pointsEarned,
  activityCount,
  description,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <p className={`mb-2 text-center text-4xl font-semibold text-black`}>
          {activityCount}
        </p>
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
            {pointsEarned}
          </h1>
        </div>
      </div>
    </div>
  );
};
