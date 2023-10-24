import { classNames } from '../../utils';
import { ProgressBar } from '../progress-bar';
import * as styles from './score-card.styles';
import { ScoreCardProps } from './score-card.types';
import { ChevronRightIcon } from '@heroicons/react/solid';

export const ScoreCard: React.FC<ScoreCardProps> = ({
  image,
  mainText,
  secondaryText,
  textPosition = 'center',
  hint,
  hintClassName,
  progressBarClassName,
  className,
  currentPoints,
  maxPoints,
  bgColour,
  barColour,
  barBgColour,
  textColour,
  onClick,
}) => {
  const percentageScore = (currentPoints / maxPoints) * 100;

  return (
    <div
      className={classNames(className, `${styles.wrapper} bg-${bgColour}`)}
      onClick={() => {
        !!onClick && onClick();
      }}
    >
      <div className={styles.content}>
        {!!image && image}
        <div
          className={classNames(progressBarClassName, 'w-full')}
          style={{ height: 80 }}
        >
          <ProgressBar
            className="h-2"
            label={mainText}
            subLabel={secondaryText || ''}
            hint={hint}
            hintClassName={hintClassName}
            textPosition={textPosition}
            value={percentageScore}
            primaryColour={barColour}
            secondaryColour={barBgColour}
            textColour={textColour}
          />
        </div>
        {!!onClick && <ChevronRightIcon className={styles.menuChevron} />}
      </div>
    </div>
  );
};

export default ScoreCard;
