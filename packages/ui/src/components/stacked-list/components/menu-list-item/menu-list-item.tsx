import { ChevronRightIcon } from '@heroicons/react/solid';
import { useMemo } from 'react';
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
  onClickItem?: (item: any) => void;
}

export const MenuListItem: React.FC<MenuListItemProps> = ({
  item,
  onClickItem,
}) => {
  const getBackground = useMemo(() => {
    if (item.hexBackgroundColor) return;

    return item.backgroundColor ? `bg-${item.backgroundColor}` : 'bg-uiBg';
  }, []);

  return (
    <div
      id={item?.id}
      className={classNames(styles.menulistItemContainer, item.className)}
      onClick={() => {
        if (!!item.onActionClick) item.onActionClick();
        else if (!!onClickItem) onClickItem(item);
      }}
    >
      <div
        className={
          item?.childList
            ? styles.contentWrapperChildList
            : classNames(styles.contentWrapper, getBackground)
        }
        style={
          item.hexBackgroundColor ? { background: item.hexBackgroundColor } : {}
        }
      >
        <div className={stackedListStyles.textRowsWrapper}>
          {item?.customIcon}
          {!item?.customIcon &&
            (item.menuIcon || item.menuIconUrl) &&
            (item.showIcon ? (
              <RoundIcon
                className="mr-4"
                hexBackgroundColor={item.iconHexBackgroundColor}
                iconColor={item.iconColor}
                backgroundColor={item.iconBackgroundColor}
                imageUrl={item.menuIconUrl}
                icon={item.menuIcon}
                iconClassName={item.menuIconClassName}
              />
            ) : (
              <div>
                <Avatar
                  className="mr-4"
                  displayBorder
                  dataUrl={item.menuIconUrl ?? ''}
                  size={'lg'}
                  borderColor={'primary'}
                />
              </div>
            ))}
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
        <div className="flex">
          {item?.subItem && (
            <p className={classNames(styles.menuSubItem, item.titleStyle)}>
              {item?.subItem}
            </p>
          )}
          {item?.likesItem && <div>{item?.likesItem}</div>}
          {item?.rightIcon ? (
            renderIcon(item.rightIcon, item.rightIconClassName)
          ) : item?.hideRightIcon ? null : (
            <ChevronRightIcon className={styles.menuChevron} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuListItem;
