import { renderIcon } from '../../../../utils';
import { Avatar } from '../../../avatar/avatar';
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
  return (
    <div
      className={styles.menulistItemContainer}
      onClick={() => item.onActionClick && item.onActionClick()}
    >
      <div className={styles.contentWrapper}>
        <div className={stackedListStyles.textRowsWrapper}>
          <div>
            {!item.icon && item.profileDataUrl ? (
              <Avatar
                className="mr-4"
                size={'md-lg'} dataUrl={item.profileDataUrl} displayBorder borderColor={item.avatarColor} />
            ) : (
              <UserAvatar
                className="mr-4"
                size={'md'}
                avatarColor={item.avatarColor}
                text={item.profileText ?? ''}
                displayBorder
              />
            )}
          </div>
          <div className={stackedListStyles.paragraphWrapper}>
            <div>
              <Typography
                className="truncate"
                type="body"
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
                  className="pl-1 truncate"
                  type="small"
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
