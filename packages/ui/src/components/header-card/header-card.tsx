import {
  ChipColourPalette,
  ChipStatus,
  ComponentBaseProps,
  HeaderSlide,
} from '../../models';
import { classNames } from '../../utils/style-class.utils';
import { StatusChip } from '../status-chip/status-chip';
import * as styles from './header-card.styles';

export interface HeaderCardProps extends ComponentBaseProps {
  slide: HeaderSlide;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({ slide, className }) => {
  const getChipStatusText = (status?: ChipStatus): string => {
    switch (status) {
      case 1:
        return 'Available now';
      case 2:
        return 'Comning soon';
      default:
        return '';
    }
  };

  const getChipStatusColourPalette = (
    status?: ChipStatus
  ): ChipColourPalette => {
    switch (status) {
      case ChipStatus.Available:
        return {
          textColour: 'white',
          borderColour: 'successMain',
          backgroundColour: 'successMain',
        };
      case ChipStatus.ComingSoon:
      default:
        return {
          textColour: 'alertMain',
          borderColour: 'alertMain',
          backgroundColour: 'white',
        };
    }
  };

  const palette = getChipStatusColourPalette(slide.status);

  return (
    <div className={classNames(styles.card, className)}>
      <div className={styles.imageWrapper}>
        <img
          src={slide.image}
          style={{ width: '100%' }}
          className={styles.cardBanner}
        />
      </div>
      <div className={styles.cardInformation}>
        <div className={styles.cardTitle}>{slide.title}</div>
        <div className={styles.cardText}>{slide.text}</div>
      </div>
    </div>
  );
};

export default HeaderCard;
