import React from 'react';
import { classNames } from '../../utils';
import { renderIcon } from '../../utils/icon-utils';
import * as styles from './round-icon.styles';
import { RoundIconProps } from './round-icon.types';

const RoundIcon: React.FC<RoundIconProps> = ({
  icon,
  iconSize,
  size,
  imageUrl,
  hexBackgroundColor,
  backgroundColor,
  iconColor,
  className,
  iconClassName,
}) => (
  <div
    className={classNames(
      styles.roundIconContainer(size),
      className,
      `bg-${backgroundColor}`,
      `text-${iconColor}`
    )}
    style={hexBackgroundColor ? { backgroundColor: hexBackgroundColor } : {}}
  >
    {imageUrl && (
      <img
        className={classNames(iconClassName, styles.roundIcon(iconSize))}
        src={imageUrl}
      />
    )}
    {icon &&
      !imageUrl &&
      renderIcon(icon, classNames(iconClassName, styles.roundIcon(iconSize)))}
  </div>
);

export { RoundIcon };
