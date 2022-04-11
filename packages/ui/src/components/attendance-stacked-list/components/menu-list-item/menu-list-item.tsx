import { ChevronRightIcon } from '@heroicons/react/solid';
import { renderIcon } from '../../../../utils';
import { MenuListDataItem } from '../../../../models';
import * as stackedListStyles from '../../../stacked-list/stacked-list.styles';
import * as styles from './menu-list-item.styles';

export interface MenuListItemProps {
  item: MenuListDataItem;
}

export function MenuListItem(props: MenuListItemProps) {
  const getIcon = (iconType: string) => {
    return renderIcon(iconType, styles.menuItemIcon);
  };
  const handler = () => {
    if (props.item.onActionClick) {
      props.item.onActionClick();
    }
  };

  return (
    <div
      className={styles.menulistItemContainer}
      onClick={() => props.item.onActionClick && props.item.onActionClick()}
    >
      <div className={styles.contentWrapper}>
        <div className={stackedListStyles.textRowsWrapper}>
          <div
            className={
              styles.menuItemIconContainer +
              (props.item.menuIconClassName ??
                styles.menuItemIconContainerDefault)
            }
          >
            {props.item.menuIcon && getIcon(props.item.menuIcon)}
          </div>
          <div className={stackedListStyles.paragraphWrapper}>
            <div>
              <p className={styles.menuTitle}>{props.item.title}</p>
              <p className={styles.menuSubTitle}>
                <span className="truncate">{props.item.subTitle}</span>
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
}

export default MenuListItem;
