import { Typography } from '@ecdlink/ui';
import { classNames } from '@ecdlink/ui';
import { ProgressTrackingLevelDisplayProps } from './progress-tracking-level-display.types';

export const ProgressTrackingLevelDisplay: React.FC<ProgressTrackingLevelDisplayProps> = ({
  level,
  className,
}) => {
  return (
    <div className={classNames('flex flex-row flex-1 items-center', className)}>
      <img className={'mr-1'} alt={`progress-tracking-level-${level?.id}`} src={level?.imageUrl} />
      <Typography
        type="small"
        weight="normal"
        color={'textMid'}
        text={level?.name || ''}
        className="font-medium"
      />
    </div>
  );
};
