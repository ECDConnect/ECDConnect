import { Colours } from '../../models/Colours';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import { classNames } from '../../utils';
import { renderIcon } from '../../utils/icon-utils';
import * as styles from './icon-wrapper.styles';

interface IconWrapperProps extends ComponentBaseProps {
  icon: string;
  iconBorderColor: Colours;
  iconColor: Colours;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  iconBorderColor,
  iconColor,
  className,
}) => {
  return (
    <div className={styles.wrapperContainer}>
      <div
        className={styles.iconWrapper(iconBorderColor)}
        data-testid="icon-wrapper"
      ></div>
      <div className={styles.iconContainer}>
        {renderIcon(icon, `z-20 w-6 h-6 text-${iconColor}`)}
      </div>
    </div>
  );
};
