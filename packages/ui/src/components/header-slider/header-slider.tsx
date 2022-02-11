import { IonSlides, IonSlide, IonContent } from '@ionic/react';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import {
  ChipColourPalette,
  ChipStatus,
} from '../status-chip/models/ChipStatus';
import StatusChip, { StatusChipProps } from '../status-chip/status-chip';
import * as styles from './header-slider.styles';
import { HeaderSlide } from './models/HeaderSlide';
import { SliderPagination } from '../slider-pagination/slider-pagination';
import { useState } from 'react';
import HeaderCard from '../header-card/header-card';

export interface HeaderSliderProps extends ComponentBaseProps {
  slides: HeaderSlide[];
}

interface SliderOptions {
  autoplay: boolean;
}

export const HeaderSlider: React.FC<HeaderSliderProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const sliderOptions: SliderOptions = {
    autoplay: false,
  };
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

  return (
    <>
      <IonSlides
        pager={false}
        options={sliderOptions}
        className={styles.swiperContainer}
        onIonSlideNextEnd={() => {
          setActiveIndex(activeIndex + 1);
        }}
        onIonSlidePrevEnd={() => {
          setActiveIndex(activeIndex - 1);
        }}
      >
        {slides.map((slide, idx) => {
          const palette = getChipStatusColourPalette(slide.status);
          return (
            <IonSlide key={`header-slide-${idx}`} className={styles.slide}>
              <div data-testid={`header-slide-${idx}`} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={slide.image}
                    style={{ width: '100%' }}
                    className={styles.cardBanner}
                  />
                </div>
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
                  <div className={styles.cardTitle}>{slide.title}</div>
                  <div className={styles.cardText}>{slide.text}</div>
                </div>
              </div>
            </IonSlide>
          );
        })}
      </IonSlides>
      <SliderPagination
        totalItems={slides.length || 0}
        activeIndex={activeIndex}
      />
    </>
  );
};

export default HeaderSlider;
