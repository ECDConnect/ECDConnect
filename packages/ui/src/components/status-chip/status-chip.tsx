import { Colours } from '../../models';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import { renderIcon } from '../../utils';
import { classNames } from '../../utils/style-class.utils';
import {
  TypographyType,
  TypographyWeight,
} from '../typography/models/TypographyTypes';

import Typography from '../typography/typography';
import * as styles from './status-chip.styles';

export interface StatusChipProps extends ComponentBaseProps {
  borderColour: Colours;
  textColour: Colours;
  backgroundColour: Colours;
  text?: string;
  icon?: string;
  iconPosition?: 'start' | 'end';
  textType?: TypographyType;
  textWeight?: TypographyWeight;
  padding?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  borderColour,
  textColour,
  backgroundColour,
  text,
  textType = 'buttonSmall',
  textWeight = 'bold',
  icon,
  iconPosition,
  padding = '',
  className,
  children,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        styles.getChipStyles(backgroundColour, borderColour, padding),
        className
      )}
      style={{ height: 'fit-content' }}
    >
      {iconPosition === 'start' &&
        icon &&
        renderIcon(icon, `w-5 h-5 text-${textColour} mr-2`)}
      <Typography
        type={textType}
        weight={textWeight}
        color={textColour}
        text={text}
        lineHeight={4}
        className="text-center"
      />
      {children}
      {iconPosition === 'end' &&
        icon &&
        renderIcon(icon, `w-5 h-5 text-${textColour} ml-2`)}
    </div>
  );
};

export default StatusChip;
