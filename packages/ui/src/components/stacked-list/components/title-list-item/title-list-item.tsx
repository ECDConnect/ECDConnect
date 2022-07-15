import { ChevronRightIcon } from '@heroicons/react/solid';
import { classNames } from '../../../..';
import { RoundIcon } from '../../../round-icon/round-icon';
import StatusChip from '../../../status-chip/status-chip';
import { TitleListDataItem } from '../../models/TitleListDataItem';
import * as stackedListStyles from '../../stacked-list.styles';
import * as styles from './title-list-item.styles';

export interface TitleListItemProps {
  item: TitleListDataItem;
}

export function TitleListItem({ item }: TitleListItemProps) {
  return (
    <div
      className={classNames(styles.titlelistItemContainer, item.classNames)}
      onClick={() => item.onActionClick()}
    >
      <div className={styles.contentWrapper}>
        <div className={stackedListStyles.textRowsWrapper}>
          <RoundIcon
            icon={item.titleIcon}
            className={classNames('mr-4', item.titleIconClassName)}
          />
          <div className={stackedListStyles.paragraphWrapper}>
            <div className={styles.title}>{item.title}</div>
          </div>
        </div>
        {item.chipConfig && (
          <div>
            <StatusChip
              backgroundColour={item.chipConfig.colorPalette.backgroundColour}
              borderColour={item.chipConfig.colorPalette.borderColour}
              textColour={item.chipConfig.colorPalette.textColour}
              text={item.chipConfig.text}
            ></StatusChip>
          </div>
        )}
        <ChevronRightIcon className={styles.titleChevron} />
      </div>
    </div>
  );
}

export default TitleListItem;
