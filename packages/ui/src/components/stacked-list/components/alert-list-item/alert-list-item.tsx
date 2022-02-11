import { StatusChip } from '../../../status-chip/status-chip';
import { renderIcon } from '../../../../utils';
import { RoundIcon } from '../../../round-icon/round-icon';
import Typography from '../../../typography/typography';
import { AlertListDataItem } from '../../models/AlertListDataItem';
import * as stackedListStyles from '../../stacked-list.styles';
import * as styles from './alert-list-item.styles';

export interface AlertListItemProps {
  item: AlertListDataItem;
}

export const AlertListItem: React.FC<AlertListItemProps> = ({ item }) => {
  return (
    <div
      className={styles.menulistItemContainer}
      onClick={() => item.onActionClick && item.onActionClick()}
    >
      <div className={styles.contentWrapper}>
        <div className={stackedListStyles.textRowsWrapper}>
          {!item.icon && (
            <div>
              {' '}
              <RoundIcon icon="RoundIcon" className="mr-4" />
            </div>
          )}
          <div className={stackedListStyles.paragraphWrapper}>
            <div>
              <Typography
                className="truncate"
                type="body"
                weight="bold"
                color="textMid"
                text={item.title}
              ></Typography>
              {item.subTitle && (
                <div className={styles.menuSubTitle}>
                  <div
                    className={styles.getShapeClassByAlertSeverity(
                      item.alertSeverity
                    )}
                  ></div>
                  <Typography
                    className="pl-1 truncate"
                    type="small"
                    weight="skinny"
                    color={styles.getColourByAlertSeverity(item.alertSeverity)}
                    text={item.subTitle ?? ''}
                  ></Typography>
                </div>
              )}
            </div>
          </div>
        </div>
        {item.chipText && (
          <StatusChip
            backgroundColour="primary"
            borderColour="transparent"
            textColour="white"
            text={item.chipText}
          >
            {renderIcon(item.chipIcon)}
          </StatusChip>
        )}
        <div>{renderIcon('ChevronRightIcon', styles.menuChevron)}</div>
      </div>
    </div>
  );
};

export default AlertListItem;
