import { StatusChip, Typography, classNames } from '@ecdlink/ui';
import { TitleStatusChipProps } from './title-status-chip.types';

export const TitleStatusChip: React.FC<TitleStatusChipProps> = ({
  timeSpan,
  titleTypographyProps,
  className,
}) => {
  return (
    <div className={classNames(className, 'flex flex-col')}>
      <Typography {...titleTypographyProps} />
      <StatusChip
        className={'mt-2'}
        backgroundColour={'infoBb'}
        borderColour={'infoBb'}
        textColour={'infoDark'}
        textType={'help'}
        text={`${timeSpan} minutes`}
      />
    </div>
  );
};
