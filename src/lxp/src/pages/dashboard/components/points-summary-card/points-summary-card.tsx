import { Button, ProgressBar, Typography } from '@ecdlink/ui';
import * as styles from './points-summary-card.styles';
import { PointsSummaryCardProps } from './points-summary-card.types';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { ReactComponent as EmojiGreat } from '@/assets/ECD_Connect_emoji1.svg';
import { ReactComponent as EmojiGood } from '@/assets/ECD_Connect_emoji3.svg';
import { ReactComponent as EmojiTry } from '@/assets/ECD_Connect_emoji11.svg';

export const PointsSummaryCard: React.FC<PointsSummaryCardProps> = ({
  currentPoints,
  maxPoints,
  onClick,
}) => {
  const percentageScore = (currentPoints / maxPoints) * 100;

  const cardBgColour =
    percentageScore < 60
      ? 'errorBg'
      : percentageScore < 80
      ? 'infoBb'
      : 'successBg';
  const progressColour =
    percentageScore < 60
      ? 'errorMain'
      : percentageScore < 80
      ? 'infoMain'
      : 'successMain';

  const getImage = () => {
    if (percentageScore < 60) {
      return <EmojiTry className="mr-2 h-16 w-16" />;
    }

    if (percentageScore < 80) {
      return <EmojiGood className="mr-2 h-16 w-16" />;
    }

    return <EmojiGreat className="mr-2 h-16 w-16" />;
  };

  return (
    <div
      className={`${styles.wrapper} bg-${cardBgColour}`}
      style={{ marginTop: '5px' }}
      onClick={() => {
        !!onClick && onClick();
      }}
    >
      <div className={styles.content}>
        {getImage()}
        <div className="h-16 w-full">
          <ProgressBar
            className="h-2"
            label={`${currentPoints} points`}
            subLabel=""
            value={percentageScore}
            primaryColour={progressColour}
            secondaryColour={'uiBg'}
          />
        </div>
        <ChevronRightIcon className={styles.menuChevron} />
      </div>
    </div>
  );
};
