import { Colours } from '../../models/Colours';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import * as styles from './avatar.styles';
import { AvatarSize } from './models/AvatarSize';

export interface AvatarProps extends ComponentBaseProps {
  dataUrl: string;
  size?: AvatarSize;
  displayBorder?: boolean;
  borderColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  dataUrl,
  size = 'lg',
  displayBorder = false,
  borderColor = 'white',
  className,
}) => {
  return (
    <div
      className={`${styles.avatar(size, displayBorder)} ${className}`}
      style={{
        ...styles.getImageDimensionsBasedOnSizeType(size, borderColor, dataUrl),
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        imageOrientation: 'none',
      }}
    ></div>
  );
};

export default Avatar;
