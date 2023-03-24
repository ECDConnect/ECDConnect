import BaseListItem from '../base-list-item/base-list-item';
import { IconImageListItemProps } from './icon-image-list-item.types';

export const IconImageListItem: React.FC<IconImageListItemProps> = ({
  color,
  icon,
  title,
  showDivider,
  backgroundColor,
  borderRadius,
  onClick,
}) => {
  const iconSlotRender = () => {
    return (
      <div
        className={
          'mr-2 flex flex-row items-center justify-center rounded-full p-4'
        }
        style={{ backgroundColor: color }}
      >
        <img className={'h-5 w-5'} src={icon} />
      </div>
    );
  };

  return (
    <BaseListItem
      titleTypography={{
        text: title,
        color: 'primary',
        type: 'unspecified',
        fontSize: '16',
      }}
      backgroundColor={backgroundColor ? backgroundColor : 'white'}
      onClick={onClick}
      dividerType={showDivider ? 'solid' : 'none'}
      dividerColor={showDivider ? 'uiBg' : 'transparent'}
      overwritePreSlotRender={iconSlotRender}
      borderRadius={borderRadius ? borderRadius : ''}
    />
  );
};
