import { ChevronRightIcon } from '@heroicons/react/solid';
import { Avatar } from '../../..';
import { classNames, ComponentBaseProps, RoundIcon } from '../../../..';
import { MenuListDataItem } from '../../models/MenuListDataItem';
import * as stackedListStyles from '../../stacked-list.styles';
import * as styles from './menu-list-item.styles';

export interface MenuListItemProps extends ComponentBaseProps {
  item: MenuListDataItem;
}

export const MenuListItem: React.FC<MenuListItemProps> = ({ item }) => {
  return (
    <div
      className={styles.menulistItemContainer}
      onClick={() => item.onActionClick && item.onActionClick()}
    >
      <div className={styles.contentWrapper}>
        <div className={stackedListStyles.textRowsWrapper}>
          {(item.menuIcon || item.menuIconUrl) &&
            (item.showIcon ? (
              <RoundIcon
                className="mr-4"
                hexBackgroundColor={item.iconHexBackgroundColor}
                iconColor={item.iconColor}
                backgroundColor={item.iconBackgroundColor}
                imageUrl={item.menuIconUrl}
                icon={item.menuIcon}
              />
            ) : (
              <Avatar
                className="mr-4"
                displayBorder
                dataUrl={item.menuIconUrl ?? ''}
                size={'lg'}
                borderColor={'primary'}
              />
            ))}
          <div className={stackedListStyles.paragraphWrapper}>
            <div>
              <p className={classNames(styles.menuTitle, item.titleStyle)}>
                {item.title}
              </p>
              <p
                className={classNames(styles.menuSubTitle, item.subTitleStyle)}
              >
                <span className="truncate">{item.subTitle}</span>
              </p>
            </div>
          </div>
        </div>
        <div>
          <ChevronRightIcon className={styles.menuChevron} />
        </div>
      </div>
    </div>
  );
};

export default MenuListItem;
