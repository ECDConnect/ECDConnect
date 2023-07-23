import { AvatarStyle } from '../avatar/avatar.styles';
import { AvatarSize } from '../avatar/models/AvatarSize';

export const wrapper = 'relative rounded-full cursor-pointer';
export const camaraWrapper =
  'rounded-full -top-1 -right-1 z-1 bg-white absolute p-1';
export const iconColor = 'text-primary';
export const getCameraIconSize = (size: AvatarSize): AvatarStyle => {
  switch (size) {
    case 'xs':
      return {
        height: '6px',
        width: '6px',
      };
    case 'sm':
      return {
        height: '8px',
        width: '8px',
      };

    case 'md':
      return {
        height: '10px',
        width: '10px',
      };
    case 'md-lg':
      return {
        height: '12px',
        width: '12px',
      };
    case 'header':
      return {
        height: '30px',
        width: '30px',
      };
    case 'lg':
    default:
      return {
        height: '14px',
        width: '14px',
      };
  }
};
