import { ProgressBar } from '@ecdlink/ui';
import * as styles from './points-summary-card.styles';
import { PointsSummaryCardProps } from './points-summary-card.types';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import { ReactComponent as EmojiOrangeSmile } from '@ecdlink/ui/src/assets/emoji/emoji_orange_smile.svg';

export const PointsSummaryCard: React.FC<PointsSummaryCardProps> = ({
  currentPoints,
  maxPoints,
  showIcon,
  useColourBackground,
  onClick,
}) => {
  const percentageScore = (currentPoints / maxPoints) * 100;

  const cardBgColour = !useColourBackground
    ? 'uiBg'
    : percentageScore < 60
    ? 'errorBg'
    : percentageScore < 80
    ? 'InfoBb'
    : 'successBg';

  const progressColour =
    percentageScore < 60
      ? 'errorMain'
      : percentageScore < 80
      ? 'secondary'
      : 'successMain';

  const getImage = () => {
    if (percentageScore < 60) {
      return <EmojiOrangeSmile className="mr-2 h-16 w-16" />;
    }

    if (percentageScore < 80) {
      return <EmojiBlueSmile className="mr-2 h-16 w-16" />;
    }

    return <EmojiGreenSmile className="mr-2 h-16 w-16" />;
  };

  return (
    <div
      className={`${styles.wrapper} bg-${cardBgColour}`}
      onClick={() => {
        !!onClick && onClick();
      }}
    >
      <div className={styles.content}>
        {showIcon && getImage()}
        <div className="h-16 w-full">
          <ProgressBar
            className="h-2"
            label={`${currentPoints} points`}
            subLabel=""
            value={percentageScore}
            primaryColour={progressColour}
            secondaryColour={useColourBackground ? 'uiBg' : 'uiLight'}
            textColour={useColourBackground ? progressColour : 'black'}
          />
        </div>
        {!!onClick && <ChevronRightIcon className={styles.menuChevron} />}
      </div>
    </div>
  );
};
