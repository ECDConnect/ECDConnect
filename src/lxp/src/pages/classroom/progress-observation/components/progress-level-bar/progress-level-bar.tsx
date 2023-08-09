import { ProgressTrackingLevelDto } from '@ecdlink/core';
import { Typography, classNames } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@store/progress-tracking';
import * as styles from './progress-level-bar.styles';
import { ProgressLevelBarProps } from './progress-level-bar.types';

export const ProgressLevelBar: React.FC<ProgressLevelBarProps> = ({
  currentLevelId,
  currentLevel,
}) => {
  const levels = useSelector(
    progressTrackingSelectors.getProgressTrackingLevels
  );

  const [filteredLevels, setFilteredLevels] =
    useState<ProgressTrackingLevelDto[]>();

  useEffect(() => {
    if (levels) {
      const filtered = levels.length > 3 ? levels.slice(1) : levels;
      setFilteredLevels(filtered);
    }
  }, [levels]);

  if (filteredLevels) {
    return (
      <div className={styles.barWrapper}>
        {filteredLevels.map((level, index) => {
          var imageUrl = '';
          if (level.imageUrl) {
            if (index + 1 < currentLevel)
              imageUrl = level.imageUrlDone || level.imageUrl;
            if (index + 1 === currentLevel) imageUrl = level.imageUrl;
            if (index + 1 > currentLevel)
              imageUrl = level.imageUrlDim || level.imageUrl;
          }
          return (
            <div
              className={classNames(styles.levelWrapper)}
              key={`progress-traking-level-` + index}
            >
              <div>
                <img
                  className={'mr-1'}
                  alt={`progress-level-${index}`}
                  src={imageUrl}
                />
              </div>
              <div>
                <Typography
                  type="buttonSmall"
                  weight="bold"
                  color={'textMid'}
                  text={level.name}
                  className="font-medium uppercase"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  } else return null;
};

export default ProgressLevelBar;
