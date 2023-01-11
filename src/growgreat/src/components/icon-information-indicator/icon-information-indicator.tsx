import { Button, RoundIcon, Typography, classNames } from '@ecdlink/ui';
import * as styles from './icon-information-indicator.styles';
import { IconInformationIndicatorProps } from './icon-information-indicator.types';

export const IconInformationIndicator: React.FC<
  IconInformationIndicatorProps
> = ({
  title,
  subTitle,
  actions,
  className,
  icon = 'PresentationChartBarIcon',
  renderCustomIcon,
}) => {
  return (
    <div className={classNames(styles.programmeContainer, className)}>
      {renderCustomIcon || (
        <RoundIcon icon={icon} className={styles.programmeIcon} />
      )}

      <Typography
        type="body"
        className="mt-4 text-lg"
        fontSize="18"
        align="center"
        weight="bold"
        text={title}
      />
      <Typography
        type="body"
        className="mt-1"
        align="center"
        weight="skinny"
        text={subTitle}
        color={'textMid'}
        fontSize="16"
      />
      {actions?.map((buttonProps) => (
        <Button key={buttonProps.text} {...buttonProps} className="mt-4" />
      ))}
    </div>
  );
};
