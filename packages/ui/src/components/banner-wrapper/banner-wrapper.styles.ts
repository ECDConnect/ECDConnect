import { Colours } from '../../models/Colours';
import { classNames } from '../../utils/style-class.utils';
import { BannerHeaderSizes } from './models';

export const content = (scrollable: boolean) =>
  `w-full ${scrollable ? 'h-full overflow-y-auto' : ''}`;
export const titleWrapper =
  'inline-block py-2 pr-2 text-center z-0 w-10/12 justify-between';
export const titleSubWrapper = 'inline-flex flex-col';
export const iconWrapperLeft = 'w-4/12 flex justify-start';
export const iconWrapperRight = 'w-4/12 flex justify-end';
export const icons = 'cursor-pointer z-10 w-auto primaryAccent2';
export const menuIcons =
  'cursor-pointer z-10 rounded-10 bg-primaryAccent1 h-10 w-10 p-2';
export const logo =
  'inline-block py-2 pr-2 text-left z-0 w-10/12 justify-between bg-bannerx2 h-16 w-16 mt-2';
export const overlayImage = 'w-full';

export const header = (
  showBackground: boolean,
  colour: Colours,
  size: BannerHeaderSizes,
  renderBorder: boolean
) => {
  const baseClass =
    'w-full flex flex-row relative justify-between items-center text-white py-4 px-4 z-10 ';
  switch (size) {
    case 'large':
      return classNames(
        showBackground ? 'bg-transparent' : `bg-${colour}`,
        baseClass,
        renderBorder ? 'h-16' : 'h-116',
        renderBorder ? 'border-t-0 border-uiMidDark border-r-0 border-l-0' : ''
      );
    case 'medium':
      return classNames(
        baseClass,
        renderBorder ? 'h-16' : 'h-116',
        showBackground ? 'bg-transparent' : `bg-${colour}`,
        renderBorder ? 'border-t-0 border-uiMidDark border-r-0 border-l-0' : ''
      );
    case 'smaller':
      return classNames(
        baseClass,
        renderBorder ? 'h-16' : 'h-16',
        showBackground ? 'bg-transparent' : `bg-${colour}`,
        renderBorder ? 'border-t-0 border-uiMidDark border-r-0 border-l-0' : ''
      );
    case 'sub-normal':
      return classNames(
        baseClass,
        renderBorder ? 'h-16' : 'h-112',
        showBackground ? 'bg-transparent' : `bg-${colour}`,
        renderBorder ? 'border-t-0 border-uiMidDark border-r-0 border-l-0' : ''
      );
    case 'normal':
      return classNames(
        baseClass,
        renderBorder ? 'h-16' : 'h-116',
        showBackground ? 'bg-transparent' : `bg-${colour}`,
        renderBorder ? 'border-t-0 border-uiMidDark border-r-0 border-l-0' : ''
      );
    case 'small':
      return classNames(
        baseClass,
        'h-16',
        showBackground ? 'bg-transparent' : `bg-${colour}`,
        renderBorder ? 'border-t-0 border-uiMidDark border-r-0 border-l-0' : ''
      );
    case 'signup':
      return classNames(
        showBackground ? 'bg-transparent' : `bg-${colour}`,
        baseClass,
        renderBorder ? 'h-16' : 'h-16',
        renderBorder ? 'border-t-0 border-uiMidDark border-r-0 border-l-0' : ''
      );
  }
};

export const backgroundWrapper = `w-full flex flex-col justify-start items-stretch relative z-10`;

const baseBackgroundImageClass = 'w-full top-0 absolute z-0 overflow-hidden';

export const backgroundImageWrapper = (
  size: BannerHeaderSizes,
  backgroundImageColour: Colours
) => {
  switch (size) {
    case 'large':
      return classNames(
        baseBackgroundImageClass,
        'h-244',
        `bg-${backgroundImageColour}`
      );
    case 'signup':
      return classNames(
        baseBackgroundImageClass,
        'h-340',
        `bg-${backgroundImageColour}`
      );
    case 'medium':
      return classNames(
        baseBackgroundImageClass,
        'h-40',
        `bg-${backgroundImageColour}`
      );
    case 'sub-normal':
      return classNames(
        baseBackgroundImageClass,
        'h-112',
        `bg-${backgroundImageColour}`
      );
    case 'small':
      return classNames(
        baseBackgroundImageClass,
        'h-40',
        `bg-${backgroundImageColour}`
      );
    case 'smaller':
      return classNames(
        baseBackgroundImageClass,
        'h-16',
        `bg-${backgroundImageColour}`
      );
    case 'normal':
      return classNames(
        baseBackgroundImageClass,
        'h-116',
        `bg-${backgroundImageColour}`
      );
  }
};

export const offlineBadgeLarge =
  'absolute z-50 top-102 left-1/2 transform -translate-x-1/2';

export const offlineBadgeSmall =
  'absolute z-50 top-54 left-1/2 transform -translate-x-1/2';

export const backgroundWrapperOfflineBadge = (renderBorder: boolean) => {
  return renderBorder ? offlineBadgeSmall : offlineBadgeLarge;
};
