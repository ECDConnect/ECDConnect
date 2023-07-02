import { useMemo } from 'react';
import { classNames, renderIcon } from '../../../../utils';
import { Avatar } from '../../../avatar/avatar';
import { RoundIcon } from '../../../round-icon/round-icon';
import Typography from '../../../typography/typography';
import UserAvatar from '../../../user-avatar/user-avatar';
import { UserAlertListDataItem } from '../../models/UserAlertListDataItem';
import * as stackedListStyles from '../../stacked-list.styles';
import * as styles from './user-alert-list-item.styles';
import { ListItem } from '../../models/ListItem';

export interface UserAlertListItemProps {
  item: UserAlertListDataItem;
  onClickItem?: (item: any) => void;
}

export const UserAlertListItem: React.FC<UserAlertListItemProps> = ({
  item,
  onClickItem,
}) => {
  const hasClickHandler =
    (!!onClickItem || !!item.onActionClick) && !item.noClick;
  const renderAvatar = useMemo(() => {
    if (item.icon) {
      return (
        <RoundIcon
          className="mr-4"
          imageUrl={item.icon}
          hexBackgroundColor={item.avatarColor}
        />
      );
    }

    if (item.profileDataUrl) {
      return (
        <Avatar
          className="mr-4"
          size={'md-lg'}
          dataUrl={item.profileDataUrl}
          displayBorder
          borderColor={item.avatarColor}
        />
      );
    }

    return (
      <UserAvatar
        className="mr-4"
        size={'md'}
        avatarColor={item.avatarColor}
        text={item.profileText ?? ''}
        displayBorder
      />
    );
  }, []);

  return (
    <div
      className={
        hasClickHandler
          ? styles.menulistItemContainer
          : styles.menuItemIconContainerNoAction
      }
      onClick={() => {
        if (!item.noClick) {
          if (!!item.onActionClick) item.onActionClick();
          else if (onClickItem) onClickItem(item);
        }
      }}
    >
      <div className={styles.contentWrapper}>
        <div className={stackedListStyles.textRowsWrapper}>
          <div>{renderAvatar}</div>
          <div className={stackedListStyles.paragraphWrapper}>
            <div>
              <Typography
                className="truncate"
                type="h4"
                weight="bold"
                color="textMid"
                text={item.title}
              ></Typography>
              <div className={styles.menuSubTitle}>
                {!item.hideAlertSeverity ? (
                  item.alertSeverityNoneIcon &&
                  item.alertSeverity === 'none' ? (
                    renderIcon(
                      item.alertSeverityNoneIcon,
                      classNames(
                        'w-4 h-4',
                        item.alertSeverityNoneColor &&
                          `text-${item.alertSeverityNoneColor}`
                      )
                    )
                  ) : (
                    <div
                      className={styles.getShapeClassByAlertSeverity(
                        item.alertSeverity
                      )}
                    ></div>
                  )
                ) : null}
                <Typography
                  className={
                    item?.childMatching
                      ? 'w-11/12 break-words pl-1'
                      : 'truncate pl-1'
                  }
                  type="help"
                  weight="skinny"
                  color={styles.getColourByAlertSeverity(item.alertSeverity)}
                  text={item.subTitle ?? ''}
                ></Typography>
              </div>
            </div>
          </div>
        </div>
        <div>
          {hasClickHandler &&
            renderIcon(
              !!item.rightIcon ? item.rightIcon : 'ChevronRightIcon',
              styles.menuChevron
            )}
        </div>
      </div>
    </div>
  );
};

export default UserAlertListItem;
