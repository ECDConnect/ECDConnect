import { Colours } from '../../models';
import { classNames } from '../../utils/style-class.utils';
import { TypographyType } from '../typography/models/TypographyTypes';
import { UserAvatarSize } from './models/UserAvatarSize';

export const avatarWrapper =
  'rounded-full inline-flex items-center align-middle justify-center font-bold';

export const getAvatarDimensionsBasedOnSizeType = (
  avatarSize: UserAvatarSize,
  displayBorder: boolean,
  borderColor: Colours
): string => {
  const borderNormal = `${
    displayBorder ? `border-2 border-${borderColor}` : ''
  }`;
  const borderLarge = `${
    displayBorder ? `border-4 border-${borderColor}` : ''
  }`;
  switch (avatarSize) {
    case 'xs':
      return classNames(avatarWrapper, 'h-6 w-6', borderNormal);
    case 'sm':
      return classNames(avatarWrapper, 'h-8 w-8', borderNormal);
    case 'sm-md':
      return classNames(avatarWrapper, 'h-11 w-11', borderNormal);
    case 'md':
    case 'md-lg':
      return classNames(avatarWrapper, 'h-12 w-12', borderLarge);
    case 'header':
      return classNames(avatarWrapper, 'h-120 w-120', borderLarge);
    case 'lg':
    default:
      return classNames(avatarWrapper, 'h-14 w-14', borderLarge);
  }
};

export const getTextType = (avatarSize: UserAvatarSize): TypographyType => {
  switch (avatarSize) {
    case 'xs':
      return 'help';
    case 'sm':
      return 'h3';
    case 'md':
      return 'h2';
    case 'header':
    case 'lg':
    default:
      return 'h1';
  }
};

export const getIconSize = (avatarSize: UserAvatarSize): string => {
  switch (avatarSize) {
    case 'xs':
      return '4';
    case 'sm':
      return '5';
    case 'sm-md':
      return '6';
    case 'md':
      return '8';
    case 'header':
    case 'lg':
    default:
      return '12';
  }
};
