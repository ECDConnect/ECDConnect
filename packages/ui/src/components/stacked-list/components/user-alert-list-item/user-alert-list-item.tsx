import { useMemo } from 'react';
import { renderIcon } from '../../../../utils';
import { Avatar } from '../../../avatar/avatar';
import { RoundIcon } from '../../../round-icon/round-icon';
import Typography from '../../../typography/typography';
import UserAvatar from '../../../user-avatar/user-avatar';
import { UserAlertListDataItem } from '../../models/UserAlertListDataItem';
import * as stackedListStyles from '../../stacked-list.styles';
import * as styles from './user-alert-list-item.styles';

export interface UserAlertListItemProps {
  item: UserAlertListDataItem;
}

export const UserAlertListItem: React.FC<UserAlertListItemProps> = ({
  item,
}) => {
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
      className={styles.menulistItemContainer}
      onClick={() => item.onActionClick && item.onActionClick()}
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
                <div
                  className={styles.getShapeClassByAlertSeverity(
                    item.alertSeverity
                  )}
                ></div>
                <Typography
                  className="truncate pl-1"
                  type="help"
                  weight="skinny"
                  color={styles.getColourByAlertSeverity(item.alertSeverity)}
                  text={item.subTitle ?? ''}
                ></Typography>
              </div>
            </div>
          </div>
        </div>
        <div>{renderIcon('ChevronRightIcon', styles.menuChevron)}</div>
      </div>
    </div>
  );
};

export default UserAlertListItem;
