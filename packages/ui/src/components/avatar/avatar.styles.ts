import { AvatarSize } from './models/AvatarSize';

export interface AvatarStyle {
  height: string;
  width: string;
  borderColor?: string;
}
export const getImageDimensionsBasedOnSizeType = (
  avatarSize: AvatarSize,
  borderColor: string,
  dataUrl: string
): AvatarStyle => {
  const base = {
    position: 'relative',
    borderColor: borderColor,
    overflow: 'hidden',
    backgroundImage: `url(${dataUrl})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  switch (avatarSize) {
    case 'xs':
      return {
        ...base,
        height: '24px',
        width: '24px',
      };
    case 'sm':
      return {
        ...base,
        height: '32px',
        width: '32px',
      };

    case 'md':
      return {
        ...base,
        height: '40px',
        width: '40px',
      };
    case 'md-lg':
      return {
        ...base,
        height: '48px',
        width: '48px',
      };
    case 'header':
      return {
        ...base,
        height: '120px',
        width: '120px',
      };
    case 'lg':
      return {
        ...base,
        height: '56px',
        width: '56px',
      };
  }
};

export const avatar = (avatarSize: AvatarSize, displayBorder: boolean) => {
  switch (avatarSize) {
    case 'xs':
      return `rounded-full ${displayBorder ? `border-2` : ''}`;
    case 'sm':
      return `rounded-full ${displayBorder ? `border-2` : ''}`;
    case 'md':
      return `rounded-full ${displayBorder ? `border-2` : ''}`;
    case 'md-lg':
      return `rounded-full ${displayBorder ? `border-2` : ''}`;
    case 'header':
      return `rounded-full ${displayBorder ? `border-4` : ''}`;
    case 'lg':
      return `rounded-full ${displayBorder ? `border-4` : ''}`;
  }
};
