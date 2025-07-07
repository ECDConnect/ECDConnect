import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import { CardBorderRaduis, CardShadowSize } from './models/CardTypes';
import * as styles from './card.styles';
import { classNames } from '../../utils/style-class.utils';

interface CardProps extends ComponentBaseProps {
  borderRaduis?: CardBorderRaduis;
  shadowSize?: CardShadowSize;
}

export const Card: React.FC<CardProps> = ({
  borderRaduis = 'sm',
  shadowSize = 'sm',
  className,
  children,
  onClick,
}) => {
  return (
    <div
      className={classNames(
        styles.getCardStyles(borderRaduis, shadowSize),
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
