import React from 'react';
import { classNames } from '../../utils';
import { renderIcon } from '../../utils/icon-utils';
import * as styles from './round-icon.styles';
import { RoundIconProps } from './round-icon.types';
import { ImageWithFallback } from '../image-with-fallback/image-with-fallback';

export const RoundIcon: React.FC<RoundIconProps> = ({
  icon,
  iconSize,
  size,
  imageUrl,
  svgIcon: SvgIconComponent,
  hexBackgroundColor,
  backgroundColor,
  iconColor,
  className,
  iconClassName,
}) => {
  const iconClasses = classNames(iconClassName, styles.roundIcon(iconSize));

  let content: React.ReactNode = null;

  // Priority order: svgIcon > imageUrl > icon string
  if (SvgIconComponent) {
    content = (
      <SvgIconComponent
        className={classNames(`text-${iconColor}`, ' h-6 w-6 flex-shrink-0 ')}
      />
    );
  } else if (imageUrl) {
    content = (
      <ImageWithFallback
        className={classNames(iconClassName, styles.roundIcon(iconSize))}
        src={imageUrl}
      />
    );
  } else if (icon) {
    content = renderIcon(
      icon,
      classNames(iconClassName, styles.roundIcon(iconSize))
    );
  }

  return (
    <div
      className={classNames(
        styles.roundIconContainer(size),
        className,
        `bg-${backgroundColor}`,
        `text-${iconColor}`
      )}
      style={hexBackgroundColor ? { backgroundColor: hexBackgroundColor } : {}}
    >
      {content}
    </div>
  );
};
