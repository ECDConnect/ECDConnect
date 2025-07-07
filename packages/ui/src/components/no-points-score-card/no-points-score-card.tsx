import { classNames } from '../../utils';
import { ProgressBar } from '../progress-bar';
import StatusChip from '../status-chip/status-chip';
import * as styles from './no-points-score-card.styles';
import { ScoreCardProps } from './no-points-score-card.types';
import { ChevronRightIcon } from '@heroicons/react/solid';

export const NoPointsScoreCard: React.FC<ScoreCardProps> = ({
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
  onClickClassName,
  statusChip,
  barSize,
  barStatusChip,
  barDivides,
  hideProgressBar,
  id,
  isHiddenSubLabel,
  isBigTitle,
}) => {
  const percentageScore = (currentPoints / maxPoints) * 100;

  return (
    <div
      id={id}
      className={classNames(className, `${styles.wrapper} bg-${bgColour}`)}
      onClick={() => {
        !!onClick && onClick();
      }}
    >
      <div className={styles.content}>
        {!!image && image}
        <div className={classNames(progressBarClassName, 'relative w-full')}>
          <ProgressBar
            className={classNames(!!onClick ? 'pr-4' : '', '')}
            style={{ marginTop: '-14px' }}
            label={mainText}
            subLabel={secondaryText || ''}
            hint={hint}
            hintClassName={hintClassName}
            textPosition={textPosition}
            value={percentageScore}
            primaryColour={barColour}
            secondaryColour={barBgColour}
            textColour={textColour}
            size={barSize}
            divides={barDivides}
            statusChip={barStatusChip}
            isHiddenBar={hideProgressBar}
            isHiddenSubLabel={isHiddenSubLabel}
            isBigTitle={isBigTitle}
          />
          {statusChip && (
            <div className="absolute right-4" style={{ top: 1.5 }}>
              <StatusChip {...statusChip} />
            </div>
          )}
        </div>
        {!!onClick && (
          <ChevronRightIcon
            className={classNames(styles.menuChevron, onClickClassName)}
          />
        )}
      </div>
    </div>
  );
};

export default NoPointsScoreCard;
