import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import Avatar from '../avatar/avatar';
import { AvatarSize } from '../avatar/models/AvatarSize';
import { CameraIcon } from '@heroicons/react/solid';
import * as styles from './profile-avatar.styles';
import { classNames } from '../../utils/style-class.utils';
import UserAvatar from '../user-avatar/user-avatar';

export interface ProfileAvatarProps extends ComponentBaseProps {
  dataUrl?: string;
  userAvatarText?: string;
  size: AvatarSize;
  hasConsent: boolean;
  canChangeImage?: boolean;
  onPressed?: () => void;
  isPreschoolImage?: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  dataUrl,
  size,
  userAvatarText = '',
  className,
  hasConsent = false,
  canChangeImage = true,
  onPressed,
  isPreschoolImage,
}) => {
  const displayAvatar: boolean = hasConsent && !!dataUrl;
  const displayUserAvatar: boolean = !hasConsent || (hasConsent && !dataUrl);
  return (
    <a
      className={classNames(styles.wrapper, className)}
      {...(canChangeImage && { onClick: onPressed })}
    >
      {displayAvatar && (
        <Avatar size={size} dataUrl={dataUrl as string} displayBorder />
      )}
      {displayUserAvatar && (
        <UserAvatar
          size={size}
          color={'quatenary'}
          text={userAvatarText}
          displayBorder={true}
          borderColour={'white'}
          isPreschoolImage={isPreschoolImage}
        />
      )}
      {canChangeImage && (
        <div
          className={styles.camaraWrapper}
          data-testid="profile-icon-wrapper"
        >
          <CameraIcon
            style={styles.getCameraIconSize(size)}
            className={styles.iconColor}
          />
        </div>
      )}
    </a>
  );
};

export default ProfileAvatar;
