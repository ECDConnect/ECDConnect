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
}) => {
  return (
    <div className={classNames(styles.programmeContainer, className)}>
      <RoundIcon icon={icon} className={styles.programmeIcon} />
      <Typography
        type="h3"
        className="mt-4"
        fontSize="16"
        align="center"
        weight="bold"
        color="textDark"
        text={title}
      />
      <Typography
        type="body"
        className="mt-1"
        weight="skinny"
        text={subTitle}
        align="center"
        color={'textMid'}
        fontSize="14"
      />
      {actions?.map((buttonProps) => (
        <Button key={buttonProps.text} {...buttonProps} className="mt-4" />
      ))}
    </div>
  );
};
