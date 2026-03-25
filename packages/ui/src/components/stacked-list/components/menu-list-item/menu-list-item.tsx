import { ChevronRightIcon } from '@heroicons/react/solid';
import { Avatar } from '../../..';
import {
  classNames,
  ComponentBaseProps,
  renderIcon,
  RoundIcon,
} from '../../../..';
import { MenuListDataItem } from '../../models/MenuListDataItem';
import * as stackedListStyles from '../../stacked-list.styles';
import * as styles from './menu-list-item.styles';

export interface MenuListItemProps extends ComponentBaseProps {
  item: MenuListDataItem;
  onClickItem?: (item: MenuListDataItem) => void;
}

export const MenuListItem: React.FC<MenuListItemProps> = ({
  item,
  onClickItem,
}) => {
  const handleClick = () => {
    item.onActionClick?.() ?? onClickItem?.(item);
  };

  // Determine background class (only if no custom hex color)
  const backgroundClass = item.hexBackgroundColor
    ? undefined
    : item.backgroundColor
    ? `bg-${item.backgroundColor}`
    : 'bg-uiBg';

  // Render the left icon/avatar part
  const renderLeftIcon = () => {
    if (item.customIcon) return item.customIcon;

    if (!item.showIcon && item?.menuIconUrl) {
      return (
        <Avatar
          className="mr-4"
          displayBorder
          dataUrl={item.menuIconUrl ?? ''}
          size="lg"
          borderColor="primary"
        />
      );
    }

    if (item.svgIcon || item.menuIconUrl || item.menuIcon) {
      return (
        <RoundIcon
          className="mr-4"
          svgIcon={item.svgIcon}
          imageUrl={item.menuIconUrl}
          icon={item.menuIcon}
          hexBackgroundColor={item.iconHexBackgroundColor}
          iconColor={item.iconColor}
          backgroundColor={item.iconBackgroundColor}
          iconClassName={item.menuIconClassName}
        />
      );
    }

    return null;
  };

  return (
    <div
      id={item?.id}
      className={classNames(styles.menulistItemContainer, item.className)}
      onClick={handleClick}
    >
      <div
        className={
          item.childList
            ? styles.contentWrapperChildList
            : classNames(styles.contentWrapper, backgroundClass)
        }
        style={
          item.hexBackgroundColor
            ? { background: item.hexBackgroundColor }
            : undefined
        }
      >
        {/* Left side: Icon + Text */}
        <div className={stackedListStyles.textRowsWrapper}>
          {renderLeftIcon()}

          <div className={stackedListStyles.paragraphWrapper}>
            <div>
              <p className={classNames(styles.menuTitle, item.titleStyle)}>
                {item.title}
              </p>

              {typeof item.subTitle === 'string' ? (
                <p
                  className={classNames(
                    styles.menuSubTitle,
                    item.subTitleStyle
                  )}
                >
                  <span>{item.subTitle}</span>
                </p>
              ) : (
                item.subTitle
              )}
            </div>
          </div>
        </div>

        {/* Right side: Sub item, likes, chevron */}
        <div className="flex items-center">
          {item.subItem && (
            <p className={classNames(styles.menuSubItem, item.titleStyle)}>
              {item.subItem}
            </p>
          )}

          {item.likesItem && <div>{item.likesItem}</div>}

          {item.rightIcon ? (
            renderIcon(item.rightIcon, item.rightIconClassName)
          ) : !item.hideRightIcon ? (
            <ChevronRightIcon className={styles.menuChevron} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MenuListItem;
