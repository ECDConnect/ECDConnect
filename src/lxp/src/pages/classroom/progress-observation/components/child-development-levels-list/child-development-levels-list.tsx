import { Typography, ComponentBaseProps, classNames } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { ProgressTrackingLevelDisplay } from '../progress-tracking-level-display/progress-tracking-level-display';

export const ChildDevelopmentLevelsList = ({
  className,
}: ComponentBaseProps) => {
  const progressLevels = useSelector(
    progressTrackingSelectors.getProgressTrackingLevels
  );

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
