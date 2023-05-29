import { ProgressTrackingLevelDto } from '@ecdlink/core';
import { Typography, ComponentBaseProps, classNames } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { ProgressTrackingLevelDisplay } from '../progress-tracking-level-display/progress-tracking-level-display';

export const ChildDevelopmentLevelsList = ({
  className,
}: ComponentBaseProps) => {
  const levels = useSelector(
    progressTrackingSelectors.getProgressTrackingLevels
  );
  const [progressLevels, setProgressLevels] =
    useState<ProgressTrackingLevelDto[]>(levels);

  // useEffect(() => {
  //   if (progressLevels && progressLevels.length > 0) {
  //     const mergedLevels: ProgressTrackingLevelDto[] = [];
  //     levelInfo.forEach((l) => {
  //       const dbLevel = progressLevels.find((dbLevel) => dbLevel.id === l.id);
  //       const mergedLevel = { ...l };
  //       if (dbLevel) {
  //         if (!mergedLevel.name) mergedLevel.name = dbLevel.name;
  //         if (!mergedLevel.imageUrl) mergedLevel.imageUrl = dbLevel.imageUrl;
  //       }
  //       mergedLevels.push(mergedLevel);
  //       setProgressLevels(mergedLevels);
  //     });
  //     // getLevelsSorted(progressLevels);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const getLevelsSorted = (levelsToSort: ProgressTrackingLevelDto[]) => {
  //   setProgressLevels(
  //     levelsToSort.slice().sort((a, b) => (a.id || 0) - (b.id || 0))
  //   );
  // };

  return (
    <div className={classNames('flex flex-col', className)}>
      <Typography
        className={'mt-1'}
        color={'textMid'}
        type={'body'}
        text={
          'Stages show how the child is learning and developing as they grow.'
        }
      />
      {progressLevels.map((level) => (
        <div key={`progress-level-${level.id}`}>
          <ProgressTrackingLevelDisplay className={'mt-3'} level={level} />
          <Typography
            className={'mt-2'}
            color={'textMid'}
            type={'unspecified'}
            weight={'normal'}
            hasMarkup
            text={level?.description || ''}
          />
        </div>
      ))}
    </div>
  );
};

export default ChildDevelopmentLevelsList;
