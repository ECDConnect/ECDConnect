import { AvatarColours, Colours } from '../../models';
import { renderIcon } from '../../utils';
import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import { classNames } from '../../utils/style-class.utils';
import Typography from '../typography/typography';
import { UserAvatarSize } from './models/UserAvatarSize';
import * as styles from './user-avatar.styles';

export interface UserAvatarProps extends ComponentBaseProps {
  size: UserAvatarSize;
  text?: string;
  avatarColor?: string;
  color?: Colours;
  displayBorder?: boolean;
  borderColour?: Colours;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 'lg',
  text = '',
  avatarColor = '',
  color = undefined,
  className,
  displayBorder = false,
  borderColour = 'transparent',
}) => {
  const textString = text.length > 2 ? text.substring(0, 2) : text;
  const iconSize = styles.getIconSize(size);
  const getAvatarToRender = () => {
    if (textString === '') {
      return renderIcon('UserIcon', `h-${iconSize} w-${iconSize} text-white`);
    } else {
      return (
        <Typography
          type={styles.getTextType(size)}
          color="white"
          text={textString}
        ></Typography>
      );
    }
  };

  return (
    <div
      style={{ backgroundColor: avatarColor }}
      className={classNames(
        styles.getAvatarDimensionsBasedOnSizeType(
          size,
          displayBorder,
          borderColour
        ),
        className,
        color ? `bg-${color}` : ''
      )}
    >
      {getAvatarToRender()}
    </div>
  );
};

export default UserAvatar;
