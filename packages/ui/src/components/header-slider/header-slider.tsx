import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import {
  ChipColourPalette,
  ChipStatus,
} from '../status-chip/models/ChipStatus';
import StatusChip from '../status-chip/status-chip';
import * as styles from './header-slider.styles';
import { HeaderSlide } from './models/HeaderSlide';
import { Carousel, CarouselProps } from 'react-responsive-carousel';
import { useWindowSize } from '@reach/window-size';
import { classNames } from '../../utils';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export interface HeaderSliderProps extends ComponentBaseProps {
  slides: HeaderSlide[];
  infiniteLoop?: boolean;
  autoPlay?: boolean;
  transitionTime?: number;
  className?: string;
  cardClassName?: string;
  isSetupComponent?: boolean;
}

const MARGIN = 32;

export const HeaderSlider: React.FC<HeaderSliderProps> = ({
  slides,
  infiniteLoop,
  autoPlay,
  transitionTime,
  className,
  cardClassName,
  isSetupComponent,
}) => {
  const { width } = useWindowSize();

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

  const renderIndicator: CarouselProps['renderIndicator'] = (
    onClickHandler,
    isSelected,
    index,
    label
  ) => {
    if (isSelected) {
      return (
        <li
          className={styles.activePaginationItem}
          aria-label={`Selected: ${label} ${index + 1}`}
          title={`Selected: ${label} ${index + 1}`}
        />
      );
    }
    return (
      <li
        className={styles.paginationItem}
        onClick={onClickHandler}
        onKeyDown={onClickHandler}
        value={index}
        key={index}
        role="button"
        tabIndex={0}
        title={`${label} ${index + 1}`}
        aria-label={`${label} ${index + 1}`}
      />
    );
  };

  return (
    <Carousel
      className={className}
      infiniteLoop={infiniteLoop}
      autoPlay={autoPlay}
      renderIndicator={renderIndicator}
      showIndicators={isSetupComponent ? false : true}
      {...(transitionTime && { transitionTime })}
    >
      {slides.map((slide, idx) => {
        const palette = getChipStatusColourPalette(slide.status);
        return (
          <div
            key={`header-slide-${idx}`}
            className={classNames(styles.slide, cardClassName)}
          >
            <div
              data-testid={`header-slide-${idx}`}
              className={styles.card}
              style={{ width: width - MARGIN }}
            >
              <div
                className={
                  !slide?.title && !slide?.text
                    ? styles.imageWrapperWithNoText
                    : styles.imageWrapper
                }
              >
                <img src={slide.image} className={styles.cardBanner} />
              </div>
              {(slide?.title || slide?.text) && (
                <div className={styles.cardInformation}>
                  {slide.status && (
                    <StatusChip
                      backgroundColour={palette.backgroundColour}
                      textColour={palette.textColour}
                      borderColour={palette.borderColour}
                      text={getChipStatusText(slide.status)}
                      className={styles.statusChip}
                    />
                  )}
                  {slide?.title && (
                    <div className={styles.cardTitle}>{slide.title}</div>
                  )}
                  {slide?.text && (
                    <div className={styles.cardText}>{slide.text}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </Carousel>
  );
};

export default HeaderSlider;
