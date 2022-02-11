import { ProgressTrackingLevelDto } from '@ecdlink/core';
import { Typography } from '@ecdlink/ui';
import { classNames } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '../../../../../store/progress-tracking';
import * as styles from './progress-level-bar.styles';
import { ProgressLevelBarProps } from './progress-level-bar.types';

export const ProgressLevelBar: React.FC<ProgressLevelBarProps> = ({ currentLevelId }) => {
  const levels = useSelector(progressTrackingSelectors.getProgressTrackingLevels);

  const [filteredLevels, setFilteredLevels] = useState<ProgressTrackingLevelDto[]>();

  useEffect(() => {
    if (levels) {
      const initialFilter = levels.filter((x) => x.name !== 'LEVEL P');
      setFilteredLevels(initialFilter);
    }
  }, [levels]);
  if (filteredLevels) {
    return (
      <div className={styles.barWrapper}>
        {filteredLevels.map((level, index) => {
          return (
            <div
              className={classNames(
                styles.levelWrapper,
                currentLevelId === level.id ? 'border-b-2 border-b-primary' : ''
              )}
              key={`progress-traking-level-` + index}
            >
              <img className={'mr-1'} alt={`progress-level-${index}`} src={level.imageUrl} />
              <Typography
                type="small"
                weight="bold"
                color={'textMid'}
                text={level.name}
                className="font-medium"
              />
            </div>
          );
        })}
      </div>
    );
  } else return null;
};

export default ProgressLevelBar;
