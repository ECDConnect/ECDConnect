import { ChevronRightIcon } from '@heroicons/react/solid';
import { renderIcon } from '../../../../utils';
import { TitleListDataItem } from '../../../../models';
import * as styles from './title-list-item.styles';

export interface TitleListItemProps {
  item: TitleListDataItem;
}

export function TitleListItem({ item }: TitleListItemProps) {
  const getIcon = (iconType: string) => {
    return renderIcon(iconType, styles.titleItemIcon);
  };

  return (
    <div
      className={styles.titlelistItemContainer}
      onClick={() => item.onActionClick()}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.textRowsWrapper}>
          <div
            className={
              styles.titleItemIconContainer +
              (item.titleIconClassName ?? styles.titleItemIconContainerDefault)
            }
          >
            {item.titleIcon && getIcon(item.titleIcon)}
          </div>
          <div className={styles.paragraphWrapper}>
            <div className={styles.title}>{item.title}</div>
          </div>
        </div>
        <ChevronRightIcon className={styles.titleChevron} />
      </div>
    </div>
  );
}

export default TitleListItem;
